const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Import routes
const calculatorRoutes = require('./routes/calculator');

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use('/', calculatorRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'ProMathX Calculator API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Define port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`ProMathX Calculator API server running on port ${PORT}`);
});

// Export app for testing purposes
module.exports = app;
