// Import the Express framework
const express = require('express');
// Initialize an Express router instance
const router = express.Router();
// Import the Dish model for MongoDB interactions
const Dish = require('../models/Dish');

// GET route to retrieve all dishes
router.get('/', async (req, res) => {
  try {
    // Fetch all dishes from the database
    const dishes = await Dish.find();
    // Send the list of dishes as a JSON response
    res.json(dishes);
  } catch (error) {
    // Handle any errors and return a 500 status with error details
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// GET route to retrieve a dish by name
router.get('/:name', async (req, res) => {
  try {
    // Find a dish by name from the URL parameter
    const dish = await Dish.findOne({ name: req.params.name });
    if (dish) {
      // If found, return the dish as a JSON response
      res.json(dish);
    } else {
      // If not found, return a 404 status with an error message
      res.status(404).json({ message: 'Dish not found' });
    }
  } catch (error) {
    // Handle any errors and return a 500 status with error details
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST route to create a new dish
router.post('/', async (req, res) => {
  // Validate request body
  const { name, ingredients, preparationSteps, cookingTime, origin, spiceLevel } = req.body;
  // Check if all required fields are provided
  if (!name || !ingredients || !preparationSteps || !cookingTime || !origin || !spiceLevel) {
    // Return a 400 status if any field is missing
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    // Create a new dish instance with the request body
    const newDish = new Dish(req.body);
    // Save the dish to the database
    await newDish.save();
    // Return a 201 status with a success message
    res.status(201).json({ message: 'Dish added successfully' });
  } catch (error) {
    // Check for duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      // Return a 409 status if the dish already exists
      res.status(409).json({ message: 'Dish already exists' });
    } else {
      // Handle other errors with a 500 status and error details
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
});

// PUT route to update a dish by ID
router.put('/:id', async (req, res) => {
  try {
    // Log the ID from the URL parameter for debugging
    console.log('Request ID:', req.params.id);
    // Log the request body for debugging
    console.log('Request Body:', req.body);

    // Find and update the dish by ID, replacing with the request body
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedDish) {
      // If updated, return the updated dish with a 200 status
      res.status(200).json(updatedDish);
    } else {
      // If not found, return a 404 status with an error message
      res.status(404).json({ message: 'Dish not found' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating dish:', error);
    // Handle any errors with a 500 status and error details
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PATCH route to partially update a dish by ID
router.patch('/:id', async (req, res) => {
  try {
    // Log the ID from the URL parameter for debugging
    console.log('Request ID:', req.params.id);
    // Log the request body for debugging
    console.log('Request Body:', req.body);

    // Use $set to update only the provided fields
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only update fields provided in the request body
      { new: true } // Return the updated document
    );

    if (updatedDish) {
      // If updated, return the updated dish with a 200 status
      res.status(200).json(updatedDish);
    } else {
      // If not found, return a 404 status with an error message
      res.status(404).json({ message: 'Dish not found' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating dish:', error);
    // Handle any errors with a 500 status and error details
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// DELETE route to remove a dish by ID
router.delete('/:id', async (req, res) => {
  try {
    // Log the ID from the URL parameter for debugging
    console.log('Request ID:', req.params.id);

    // Find and delete the dish by ID
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (dish) {
      // If deleted, return a 200 status with a success message
      res.status(200).json({ message: 'Dish deleted successfully' });
    } else {
      // If not found, return a 404 status with an error message
      res.status(404).json({ message: 'Dish not found' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error deleting dish:', error);
    // Handle any errors with a 500 status and error details
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Export the router to be used in the main application
module.exports = router;