const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:name', async (req, res) => {
    try {
        const dish = await Dish.findOne({ name: req.params.name });
        if(dish) {
            res.json(dish);
        } else {
            res.status(404).json({ message: 'Dish not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/', async (req, res) => {
    const { name, ingredients, preparationsSteps, cookingTime, origin, spiceLevel } = req.body;
    if (!name || !ingredients || !preparationsSteps || !cookingTime || !origin || !spiceLevel) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newDish = new Dish(req.body);
        await newDish.save();
        res.status(201).json({ message: 'Dish created successfully', dish: newDish });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Dish already exists' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});