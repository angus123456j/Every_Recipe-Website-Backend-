const Recipe = require('../Models/Recipes')

// Add new recipe
const createRecipe = async (data) => {
    const newRecipe = new Recipe(data)
    return await newRecipe.save();
};

//Fetch all recipes
const fetchRecipe = async () => {
    return await Recipe.find();
};

//Fetch recipes by userId
const fetchRecipesByUserId = async (userId) => {
    return await Recipe.find({ userId: userId });
};

//Search recipes with filters
const searchRecipes = async (searchParams) => {
    let query = {};
    
    // Text search in title and tags
    if (searchParams.query) {
        query.$or = [
            { title: { $regex: searchParams.query, $options: 'i' } },
            { tags: { $regex: searchParams.query, $options: 'i' } }
        ];
    }
    
    // Tag filtering
    if (searchParams.tags && searchParams.tags.length > 0) {
        query.tags = { $all: searchParams.tags };
    }
    
    // Time range filtering
    if (searchParams.timeRange) {
        const timeQuery = {};
        
        if (searchParams.timeRange.min !== undefined) {
            timeQuery.$gte = searchParams.timeRange.min;
        }
        
        if (searchParams.timeRange.max !== undefined) {
            timeQuery.$lte = searchParams.timeRange.max;
        }
        
        if (Object.keys(timeQuery).length > 0) {
            query.time = timeQuery;
        }
    }
    
    return await Recipe.find(query);
};

const getRecipeByID = async(id) =>  {
    return await Recipe.findById(id);
};

const deleteRecipe = async(id) =>{
    return await Recipe.findByIdAndDelete(id);
};

// Update recipe
const updateRecipe = async(id, data) => {
    return await Recipe.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
    createRecipe,
    fetchRecipe,
    fetchRecipesByUserId,
    searchRecipes,
    getRecipeByID,
    deleteRecipe,
    updateRecipe,
};