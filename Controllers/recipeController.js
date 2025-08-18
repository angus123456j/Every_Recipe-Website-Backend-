const recipeService = require('../Services/recipeService')

const addRecipe = async(req, res) => {
    console.log("addRecipe");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        // Include imageURL from S3 upload if available
        const recipeData = {
            ...req.body,
            userId: currentUserId, // Ensure the recipe is associated with the current user
            imageURL: req.imageURL || null
        };
        
        console.log("Recipe data:", recipeData);
        
        const recipe = await recipeService.createRecipe(recipeData)
        res.status(201).json(recipe)
    } catch (err) {
        console.error("Error in addRecipe:", err);
        res.status(500).json({error:'Failed to create recipe', details: err.message})
    }
};

const searchRecipes = async (req, res) => {
    console.log("searchRecipes");
    
    try {
        const { q, tags, minTime, maxTime } = req.query;
        
        const searchParams = {
            query: q,
            tags: tags ? tags.split(',') : [],
            timeRange: {
                min: minTime ? parseInt(minTime) : undefined,
                max: maxTime ? parseInt(maxTime) : undefined
            }
        };
        
        const recipes = await recipeService.searchRecipes(searchParams);
        res.json(recipes);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Failed to search recipes' });
    }
};

const fetchRecipes = async(req, res) => {
    console.log("fetchRecipe");

    try {
        // Check if userId query parameter is provided
        const { userId } = req.query;
        
        if (userId) {
            // Filter recipes by userId
            const recipes = await recipeService.fetchRecipesByUserId(userId);
            res.json(recipes);
        } else {
            // Fetch all recipes
            const recipes = await recipeService.fetchRecipe();
            res.json(recipes);
        }
    } catch (err) {
        res.status(500).json({error:'Failed to fetch recipe'})
    }
};


const obtainRecipeByID = async(req, res) => {
    console.log("getRecipebyID");

    try {
        const result = await recipeService.getRecipeByID(req.params.id)
        if (!result){
            return res.status(404).json({error: "Recipe does not exist"})
        }
        res.status(200).json(result)
    } catch (err) {
        console.error("Error in obtainRecipeByID:", err);
        res.status(500).json({error:'Failed to get recipe by ID', details: err.message})
    }
};


const deleteRecipeByID = async(req, res) => {
    console.log("deleteRecipebyID");

    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        // Check if recipe exists and user owns it
        const existingRecipe = await recipeService.getRecipeByID(req.params.id);
        if (!existingRecipe) {
            return res.status(404).json({error: "Recipe does not exist"});
        }
        
        // Verify ownership
        if (existingRecipe.userId !== currentUserId) {
            return res.status(403).json({error: "You can only delete your own recipes"});
        }
        
        const deleted = await recipeService.deleteRecipe(req.params.id)
        if (!deleted){
            return res.status(404).json({error: "Recipe does not exist"})
        }
        res.status(200).json({message: "Recipe successfully deleted"})
    } catch (err) {
        console.error("Error in deleteRecipeByID:", err);
        res.status(500).json({error: err.message})
    }
};

const updateRecipeByID = async(req, res) => {
    console.log("updateRecipebyID");

    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        // Check if recipe exists and user owns it
        const existingRecipe = await recipeService.getRecipeByID(req.params.id);
        if (!existingRecipe) {
            return res.status(404).json({error: "Recipe does not exist"});
        }
        
        // Verify ownership
        if (existingRecipe.userId !== currentUserId) {
            return res.status(403).json({error: "You can only edit your own recipes"});
        }
        
        // Include imageURL from S3 upload if available
        const recipeData = {
            ...req.body,
            ...(req.imageURL && { imageURL: req.imageURL })
        };
        
        console.log("Update recipe data:", recipeData);
        
        const updated = await recipeService.updateRecipe(req.params.id, recipeData)
        if (!updated){
            return res.status(404).json({error: "Recipe does not exist"})
        }
        res.status(200).json(updated)
    } catch (err) {
        console.error("Error in updateRecipeByID:", err);
        res.status(500).json({error:'Failed to update recipe', details: err.message})
    }
};

module.exports = {
    addRecipe,
    searchRecipes,
    fetchRecipes,
    obtainRecipeByID,
    deleteRecipeByID,
    updateRecipeByID,
};


