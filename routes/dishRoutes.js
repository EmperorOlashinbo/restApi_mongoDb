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
router.put('/:id', async (req, res) => {
    try {
        console.log('Request ID:', req.params.id);
        console.log('Request Body:', req.body);

        const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedDish) {
            res.status(200).json(updatedDish);
        } else {
            res.status(404).json({ message: 'Dish not found' });
        }
    } catch (error) {
        console.error('Error updating dish:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        console.log('Request ID:', req.params.id);
        console.log('Request Body:', req.body);

        const updatedDish = await Dish.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true });
        if (updatedDish) {
            res.status(200).json(updatedDish);
        } else {
            res.status(404).json({ message: 'Dish not found' });
        }
    } catch (error) {
        console.error('Error updating dish:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const dish = await Dish.findByIdAndDelete(req.params.id);
        if (dish) {
            res.status(200).json({ message: 'Dish deleted successfully' });
        } else {
            res.status(404).json({ message: 'Dish not found' });
        }
    } catch (error) {
        console.error('Error deleting dish:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;