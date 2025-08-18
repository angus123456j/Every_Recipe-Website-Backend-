const Joi = require('joi');

const createAlbumSchema = Joi.object({
    name: Joi.string().required().min(1).max(100).messages({
        'string.empty': 'Album name is required',
        'string.min': 'Album name must be at least 1 character long',
        'string.max': 'Album name must be less than 100 characters'
    }),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#3B82F6').messages({
        'string.pattern.base': 'Color must be a valid hex color (e.g., #3B82F6)'
    }),
    // userId comes from session
    userId: Joi.forbidden()
});

const updateAlbumSchema = Joi.object({
    name: Joi.string().min(1).max(100).optional().messages({
        'string.min': 'Album name must be at least 1 character long',
        'string.max': 'Album name must be less than 100 characters'
    }),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional().messages({
        'string.pattern.base': 'Color must be a valid hex color (e.g., #3B82F6)'
    })
});

const addRecipeToAlbumSchema = Joi.object({
    recipeId: Joi.string().required().messages({
        'string.empty': 'Recipe ID is required'
    })
});

module.exports = {
    createAlbumSchema,
    updateAlbumSchema,
    addRecipeToAlbumSchema
};

