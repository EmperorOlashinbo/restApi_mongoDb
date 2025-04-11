const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next(err);
});


let server;

server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.CONNECTION_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

function shutdown(){
    console.log('Shutting down server...');
    server.close(async () => {
        console.log('HTTP server closed')
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed')
            process.exit(0);
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
            process.exit(1);
        }
    });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);