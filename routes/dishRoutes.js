// Import required modules
const express = require('express'); // Express framework for creating routes
const router = express.Router(); // Router instance for defining routes
const Dish = require('../models/Dish'); // Mongoose model for the Dish collection

// Route to get all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find(); // Fetch all dishes from the database
    res.json(dishes); // Send the dishes as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle errors
  }
});

// Route to get a dish by name
router.get('/:name', async (req, res) => {
  try {
    const dish = await Dish.findOne({ name: req.params.name }); // Find a dish by its name
    if (dish) {
      res.json(dish); // Send the dish as a JSON response
    } else {
      res.status(404).json({ message: 'Dish not found' }); // Send a 404 if the dish is not found
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle errors
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id); // Find a dish by its ID
    if (dish) {
      res.json(dish); // Send the dish as a JSON response
    } else {
      res.status(404).json({ message: 'Dish not found' }); // Send a 404 if the dish is not found
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle errors
  }
});

// Route to add a new dish
router.post('/', async (req, res) => {
  // Validate request body
  const { name, ingredients, preparationSteps, cookingTime, origin, spiceLevel } = req.body;
  if (!name || !ingredients || !preparationSteps || !cookingTime || !origin || !spiceLevel) {
    return res.status(400).json({ message: 'All fields are required' }); // Return 400 if any field is missing
  }
  try {
    const newDish = new Dish(req.body); // Create a new dish instance
    await newDish.save(); // Save the dish to the database
    res.status(201).json({ message: 'Dish added successfully' }); // Send a success response
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: 'Dish already exists' }); // Handle duplicate dish names
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle other errors
    }
  }
});

// Route to update a dish (replace all fields)
router.put('/:id', async (req, res) => {
  try {
    console.log('Request ID:', req.params.id); // Log the ID
    console.log('Request Body:', req.body); // Log the request body

    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the dish
    if (updatedDish) {
      res.status(200).json(updatedDish); // Send the updated dish as a JSON response
    } else {
      res.status(404).json({ message: 'Dish not found' }); // Send a 404 if the dish is not found
    }
  } catch (error) {
    console.error('Error updating dish:', error); // Log the error
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle errors
  }
});

// Route to partially update a dish (update specific fields)
router.patch('/:id', async (req, res) => {
  try {
    console.log('Request ID:', req.params.id); // Log the ID
    console.log('Request Body:', req.body); // Log the request body

    // Use $set to update only the provided fields
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only update the fields provided in req.body
      { new: true } // Return the updated document
    );

    if (updatedDish) {
      res.status(200).json(updatedDish); // Send the updated dish as a JSON response
    } else {
      res.status(404).json({ message: 'Dish not found' }); // Send a 404 if the dish is not found
    }
  } catch (error) {
    console.error('Error updating dish:', error); // Log the error
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle errors
  }
});

// Route to delete a dish by ID
router.delete('/:id', async (req, res) => {
  try {
    console.log('Request ID:', req.params.id); // Log the ID

    const dish = await Dish.findByIdAndDelete(req.params.id); // Delete the dish by ID
    if (dish) {
      res.status(200).json({ message: 'Dish deleted successfully' }); // Send a success response
    } else {
      res.status(404).json({ message: 'Dish not found' }); // Send a 404 if the dish is not found
    }
  } catch (error) {
    console.error('Error deleting dish:', error); // Log the error
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Handle errors
  }
});

// Export the router to be used in other parts of the application
module.exports = router;