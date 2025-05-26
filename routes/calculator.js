const express = require('express');
const router = express.Router();
const calculator = require('../calculator');

// POST /calculate - Evaluate mathematical expressions
router.post('/calculate', (req, res) => {
    try {
        const { expression } = req.body;
        
        if (!expression) {
            return res.status(400).json({
                status: 'error',
                message: 'Expression is required'
            });
        }

        const result = calculator.evaluate(expression);
        
        res.json({
            status: 'success',
            result: result,
            scientific: calculator.scientific.format(result)
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /memory - Recall stored value
router.get('/memory', (req, res) => {
    const value = calculator.memory.recall();
    res.json({
        status: 'success',
        value: value
    });
});

// POST /memory - Store value in memory
router.post('/memory', (req, res) => {
    try {
        const { value } = req.body;
        
        if (value === undefined || value === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Value is required'
            });
        }

        const numValue = Number(value);
        if (isNaN(numValue)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid numeric value'
            });
        }

        calculator.memory.store(numValue);
        res.json({
            status: 'success',
            message: 'Value stored in memory'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /memory - Clear memory
router.delete('/memory', (req, res) => {
    calculator.memory.clear();
    res.json({
        status: 'success',
        message: 'Memory cleared'
    });
});

module.exports = router;
