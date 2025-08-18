const albumService = require('../Services/albumService');

// Create a new album
const createAlbum = async (req, res) => {
    console.log("createAlbum");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const albumData = {
            ...req.body,
            userId: currentUserId // Use authenticated user's ID
        };
        
        console.log("Album data:", albumData);
        
        const album = await albumService.createAlbum(albumData);
        res.status(201).json(album);
    } catch (err) {
        console.error("Error in createAlbum:", err);
        res.status(500).json({ error: 'Failed to create album', details: err.message });
    }
};

// Get all albums for a user
const getUserAlbums = async (req, res) => {
    console.log("getUserAlbums");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        // Ensure user can only access their own albums
        const { userId } = req.params;
        if (userId !== currentUserId) {
            return res.status(403).json({ error: "You can only access your own albums" });
        }
        
        const albums = await albumService.getUserAlbums(userId);
        res.json(albums);
    } catch (err) {
        console.error("Error in getUserAlbums:", err);
        res.status(500).json({ error: 'Failed to fetch user albums', details: err.message });
    }
};

// Get a specific album by ID
const getAlbumById = async (req, res) => {
    console.log("getAlbumById");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const { albumId } = req.params;
        const album = await albumService.getAlbumById(albumId);
        
        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        // Ensure user can only access their own albums
        if (album.userId !== currentUserId) {
            return res.status(403).json({ error: "You can only access your own albums" });
        }
        
        res.json(album);
    } catch (err) {
        console.error("Error in getAlbumById:", err);
        res.status(500).json({ error: 'Failed to fetch album', details: err.message });
    }
};

// Update an album
const updateAlbum = async (req, res) => {
    console.log("updateAlbum");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const { albumId } = req.params;
        const updateData = req.body;
        
        // Check if album exists and user owns it
        const existingAlbum = await albumService.getAlbumById(albumId);
        if (!existingAlbum) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        // Ensure user can only update their own albums
        if (existingAlbum.userId !== currentUserId) {
            return res.status(403).json({ error: "You can only update your own albums" });
        }
        
        const updatedAlbum = await albumService.updateAlbum(albumId, updateData);
        
        if (!updatedAlbum) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        res.json(updatedAlbum);
    } catch (err) {
        console.error("Error in updateAlbum:", err);
        res.status(500).json({ error: 'Failed to update album', details: err.message });
    }
};

// Delete an album
const deleteAlbum = async (req, res) => {
    console.log("deleteAlbum");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const { albumId } = req.params;
        
        // Check if album exists and user owns it
        const existingAlbum = await albumService.getAlbumById(albumId);
        if (!existingAlbum) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        // Ensure user can only delete their own albums
        if (existingAlbum.userId !== currentUserId) {
            return res.status(403).json({ error: "You can only delete your own albums" });
        }
        
        const deleted = await albumService.deleteAlbum(albumId);
        
        if (!deleted) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        res.status(200).json({ message: "Album successfully deleted" });
    } catch (err) {
        console.error("Error in deleteAlbum:", err);
        res.status(500).json({ error: 'Failed to delete album', details: err.message });
    }
};

// Add a recipe to an album
const addRecipeToAlbum = async (req, res) => {
    console.log("addRecipeToAlbum");
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const { albumId } = req.params;
        const { recipeId } = req.body;
        
        console.log("AlbumId:", albumId);
        console.log("RecipeId:", recipeId);
        
        // Check if album exists and user owns it
        const existingAlbum = await albumService.getAlbumById(albumId);
        if (!existingAlbum) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        // Ensure user can only add recipes to their own albums
        if (existingAlbum.userId !== currentUserId) {
            return res.status(403).json({ error: "You can only add recipes to your own albums" });
        }
        
        const updatedAlbum = await albumService.addRecipeToAlbum(albumId, recipeId);
        res.json(updatedAlbum);
    } catch (err) {
        console.error("Error in addRecipeToAlbum:", err);
        res.status(500).json({ error: 'Failed to add recipe to album', details: err.message });
    }
};

// Remove a recipe from an album
const removeRecipeFromAlbum = async (req, res) => {
    console.log("removeRecipeFromAlbum");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const { albumId, recipeId } = req.params;
        
        // Check if album exists and user owns it
        const existingAlbum = await albumService.getAlbumById(albumId);
        if (!existingAlbum) {
            return res.status(404).json({ error: "Album not found" });
        }
        
        // Ensure user can only remove recipes from their own albums
        if (existingAlbum.userId !== currentUserId) {
            return res.status(403).json({ error: "You can only remove recipes from your own albums" });
        }
        
        const updatedAlbum = await albumService.removeRecipeFromAlbum(albumId, recipeId);
        res.json(updatedAlbum);
    } catch (err) {
        console.error("Error in removeRecipeFromAlbum:", err);
        res.status(500).json({ error: 'Failed to remove recipe from album', details: err.message });
    }
};

// Check if a recipe is saved by a user
const checkRecipeSaved = async (req, res) => {
    console.log("checkRecipeSaved");
    try {
        // Get the current user's ID from session
        const currentUserId = req.session.userInfo?.username || "123"; // Fallback for now
        
        const { userId, recipeId } = req.params;
        
        // Ensure user can only check their own saved recipes
        if (userId !== currentUserId) {
            return res.status(403).json({ error: "You can only check your own saved recipes" });
        }
        
        const isSaved = await albumService.isRecipeSavedByUser(userId, recipeId);
        res.json({ isSaved });
    } catch (err) {
        console.error("Error in checkRecipeSaved:", err);
        res.status(500).json({ error: 'Failed to check recipe saved status', details: err.message });
    }
};

module.exports = {
    createAlbum,
    getUserAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
    addRecipeToAlbum,
    removeRecipeFromAlbum,
    checkRecipeSaved
};
