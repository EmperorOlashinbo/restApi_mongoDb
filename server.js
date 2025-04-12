// Import the Express framework for building the web server
const express = require('express');
// Import Mongoose for MongoDB database interaction
const mongoose = require('mongoose');
// Import CORS middleware to enable cross-origin resource sharing
const cors = require('cors');
// Import the dishRoutes module for handling dish-related API routes
const dishRoutes = require('./routes/dishRoutes');

// Initialize the Express application
const app = express();
// Set the port to an environment variable or default to 5000
const port = process.env.PORT || 5000;

// Enable CORS for all routes to allow requests from different origins
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
// Parse URL-encoded data with extended option for complex objects
app.use(express.urlencoded({ extended: true }));

// Error handling middleware to catch and handle errors
app.use((err, req, res, next) => {
  // Log the error stack for debugging
  console.error(err.stack);
  // Send a 500 status with a generic error message
  res.status(500).send('Something broke!');
  // Pass the error to the next middleware
  next(err);
});

// Mount the dishRoutes at the /api/dishes endpoint
app.use('/api/dishes', dishRoutes);

// Declare a variable to store the server instance
let server;

// Start the server and listen on the specified port
server = app.listen(port, () => {
  // Log a message when the server starts successfully
  console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB using the connection URL from environment variables
mongoose.connect(process.env.CONNECTION_URL)
  // Log success message when connected
  .then(() => console.log('Connected to MongoDB'))
  // Log any errors that occur during connection
  .catch((error) => console.error('MongoDB connection error:', error));

// Define a function to gracefully shut down the server
function shutdown() {
  // Log that the shutdown process has started
  console.log('Shutting down server...');
  // Close the HTTP server
  server.close(async () => {
    // Log when the HTTP server is closed
    console.log('HTTP server closed.');
    try {
      // Close the MongoDB connection
      await mongoose.connection.close();
      // Log when the MongoDB connection is closed
      console.log('MongoDB connection closed.');
      // Exit the process successfully
      process.exit(0);
    } catch (error) {
      // Log any errors during MongoDB connection closure
      console.error('Error closing MongoDB connection:', error);
      // Exit the process with an error code
      process.exit(1);
    }
  });
}

// Listen for SIGINT signal (e.g., Ctrl+C) to trigger shutdown
process.on('SIGINT', shutdown);
// Listen for SIGTERM signal (e.g., process termination) to trigger shutdown
process.on('SIGTERM', shutdown);