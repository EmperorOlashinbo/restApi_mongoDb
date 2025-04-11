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