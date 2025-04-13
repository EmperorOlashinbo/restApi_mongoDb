// Import required modules
const express = require('express'); // Express framework for building the server
const mongoose = require('mongoose'); // Mongoose for MongoDB connection and schema management
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const dishRoutes = require('./routes/dishRoutes'); // Import routes for dish-related operations

// Initialize the Express application
const app = express();
const port = process.env.PORT || 5000; // Use the port from .env or default to 5000

// Middleware to enable CORS and parse incoming requests
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).send('Something broke!'); // Send a generic error response
  next(err); // Pass the error to the next middleware
});

// Define the route for dish-related operations
app.use('/api/dishes', dishRoutes); // All routes starting with /api/dishes will use dishRoutes

// Declare a variable to hold the server instance
let server;

// Start the server and listen on the specified port
server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log the server start message
});

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.CONNECTION_URL)
  .then(() => console.log('Connected to MongoDB')) // Log successful connection
  .catch((error) => console.error('MongoDB connection error:', error)); // Log connection errors

// Function to handle graceful shutdown of the server and database connection
function shutdown() {
  console.log('Shutting down server...');
  server.close(async () => { // Close the HTTP server
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close(); // Close the MongoDB connection
      console.log('MongoDB connection closed.');
      process.exit(0); // Exit the process with success code
    } catch (error) {
      console.error('Error closing MongoDB connection:', error); // Log any errors during shutdown
      process.exit(1); // Exit the process with error code
    }
  });
}

// Handle termination signals (e.g., Ctrl+C or system termination)
process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signals from the system