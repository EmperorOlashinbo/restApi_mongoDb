const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    id: String,
    name: {type: String, required: true, unique: true},
    ingredients: [String],
    preparationsSteps: [String],
    cookingTime: String,
    origin: String,
    spiceLevel: String
});

module.exports = mongoose.model('Dish', dishSchema);