const Album = require('../Models/Albums');
const Recipe = require('../Models/Recipes');

// Create a new album
const createAlbum = async (albumData) => {
    const newAlbum = new Album(albumData);
    return await newAlbum.save();
};

// Get all albums for a specific user
const getUserAlbums = async (userId) => {
    const albums = await Album.find({ userId: userId }).populate('recipes.recipeId');
    
    // Clean up invalid recipe references for each album
    for (const album of albums) {
        const validRecipes = album.recipes.filter(recipe => recipe.recipeId != null);
        
        if (validRecipes.length !== album.recipes.length) {
            console.log(`Cleaning up ${album.recipes.length - validRecipes.length} invalid recipe references from album ${album._id}`);
            album.recipes = validRecipes;
            await album.save();
        }
    }
    
    return albums;
};

// Get a specific album by ID
const getAlbumById = async (albumId) => {
    const album = await Album.findById(albumId).populate('recipes.recipeId');
    
    if (album) {
        // Filter out recipes where recipeId is null (deleted recipes)
        const validRecipes = album.recipes.filter(recipe => recipe.recipeId != null);
        
        // If we found invalid recipes, clean them up
        if (validRecipes.length !== album.recipes.length) {
            console.log(`Cleaning up ${album.recipes.length - validRecipes.length} invalid recipe references from album ${albumId}`);
            album.recipes = validRecipes;
            await album.save();
        }
    }
    
    return album;
};

// Update an album
const updateAlbum = async (albumId, updateData) => {
    return await Album.findByIdAndUpdate(albumId, updateData, { new: true }).populate('recipes.recipeId');
};

// Delete an album
const deleteAlbum = async (albumId) => {
    return await Album.findByIdAndDelete(albumId);
};

// Add a recipe to an album
const addRecipeToAlbum = async (albumId, recipeId) => {
    console.log("Service - AlbumId:", albumId);
    console.log("Service - RecipeId:", recipeId);
    
    if (!recipeId) {
        throw new Error('Recipe ID is required');
    }
    
    const album = await Album.findById(albumId);
    if (!album) {
        throw new Error('Album not found');
    }

    // Check if recipe already exists in album
    const existingRecipe = album.recipes.find(recipe => recipe.recipeId.toString() === recipeId);
    if (existingRecipe) {
        throw new Error('Recipe already exists in this album');
    }

    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        throw new Error('Recipe not found');
    }

    // Add recipe to album
    album.recipes.push({ recipeId: recipeId });
    return await album.save();
};

// Remove a recipe from an album
const removeRecipeFromAlbum = async (albumId, recipeId) => {
    const album = await Album.findById(albumId);
    if (!album) {
        throw new Error('Album not found');
    }

    album.recipes = album.recipes.filter(recipe => recipe.recipeId.toString() !== recipeId);
    return await album.save();
};

// Check if a recipe is saved in any album for a user
const isRecipeSavedByUser = async (userId, recipeId) => {
    const album = await Album.findOne({
        userId: userId,
        'recipes.recipeId': recipeId
    });
    return !!album;
};

module.exports = {
    createAlbum,
    getUserAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
    addRecipeToAlbum,
    removeRecipeFromAlbum,
    isRecipeSavedByUser
};
