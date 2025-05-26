/**
 * ProMathX Calculator Core Module
 * Provides comprehensive mathematical operations including arithmetic, 
 * trigonometric, logarithmic, and memory functions.
 */

// Memory storage (initialized as null)
let memoryValue = null;

/**
 * Expression parser and evaluator
 */
class ExpressionEvaluator {
    // PUBLIC_INTERFACE
    /**
     * Evaluates a mathematical expression string
     * @param {string} expression - The mathematical expression to evaluate
     * @returns {number} The result of the evaluation
     * @throws {Error} If the expression is invalid
     */
    static evaluate(expression) {
        try {
            // Remove whitespace and validate characters
            expression = expression.replace(/\s+/g, '');
            if (!/^[-0-9+/*().\^e,sincostanlgxp]+$/i.test(expression)) {
                throw new Error('Invalid characters in expression');
            }
            
            return this.parseExpression(expression);
        } catch (error) {
            throw new Error(`Error evaluating expression: ${error.message}`);
        }
    }

    /**
     * Parses and evaluates a mathematical expression
     * @private
     */
    static parseExpression(expr) {
        let tokens = this.tokenize(expr);
        return this.evaluateTokens(tokens);
    }

    /**
     * Tokenizes an expression into components
     * @private
     */
    static tokenize(expr) {
        // Handle functions and operators
        let tokens = [];
        let numBuffer = '';
        let i = 0;

        while (i < expr.length) {
            let char = expr[i];

            // Handle numbers (including scientific notation)
            if (/[\d.]/.test(char) || (char === 'e' && /\d/.test(expr[i+1]))) {
                numBuffer += char;
            }
            // Handle operators and functions
            else {
                if (numBuffer) {
                    tokens.push(Number(numBuffer));
                    numBuffer = '';
                }
                
                // Handle multi-character functions
                if (/[a-z]/i.test(char)) {
                    let funcName = '';
                    while (i < expr.length && /[a-z]/i.test(expr[i])) {
                        funcName += expr[i];
                        i++;
                    }
                    i--;
                    tokens.push(funcName);
                } else {
                    tokens.push(char);
                }
            }
            i++;
        }
        
        if (numBuffer) {
            tokens.push(Number(numBuffer));
        }

        return tokens;
    }

    /**
     * Evaluates tokenized expression
     * @private
     */
    static evaluateTokens(tokens) {
        // Handle parentheses first
        let i = 0;
        while (i < tokens.length) {
            if (tokens[i] === '(') {
                let j = i + 1;
                let parenthesesCount = 1;
                
                while (j < tokens.length && parenthesesCount > 0) {
                    if (tokens[j] === '(') parenthesesCount++;
                    if (tokens[j] === ')') parenthesesCount--;
                    j++;
                }
                
                if (parenthesesCount > 0) throw new Error('Mismatched parentheses');
                
                let subExpr = tokens.slice(i + 1, j - 1);
                let result = this.evaluateTokens(subExpr);
                
                tokens.splice(i, j - i, result);
            }
            i++;
        }

        // Handle functions
        i = 0;
        while (i < tokens.length) {
            if (typeof tokens[i] === 'string' && isNaN(tokens[i])) {
                let func = tokens[i];
                let value = tokens[i + 1];
                
                if (typeof value !== 'number') {
                    throw new Error(`Invalid argument for function ${func}`);
                }

                let result;
                switch (func.toLowerCase()) {
                    case 'sin': result = Math.sin(value); break;
                    case 'cos': result = Math.cos(value); break;
                    case 'tan': result = Math.tan(value); break;
                    case 'asin': result = Math.asin(value); break;
                    case 'acos': result = Math.acos(value); break;
                    case 'atan': result = Math.atan(value); break;
                    case 'log': case 'log10': result = Math.log10(value); break;
                    case 'ln': result = Math.log(value); break;
                    case 'exp': result = Math.exp(value); break;
                    default: throw new Error(`Unknown function: ${func}`);
                }
                
                tokens.splice(i, 2, result);
            }
            i++;
        }

        // Handle multiplication and division
        i = 1;
        while (i < tokens.length - 1) {
            if (tokens[i] === '*' || tokens[i] === '/') {
                let result;
                if (tokens[i] === '*') {
                    result = tokens[i - 1] * tokens[i + 1];
                } else {
                    if (tokens[i + 1] === 0) throw new Error('Division by zero');
                    result = tokens[i - 1] / tokens[i + 1];
                }
                tokens.splice(i - 1, 3, result);
                i--;
            } else {
                i++;
            }
        }

        // Handle addition and subtraction
        i = 1;
        while (i < tokens.length - 1) {
            if (tokens[i] === '+' || tokens[i] === '-') {
                let result;
                if (tokens[i] === '+') {
                    result = tokens[i - 1] + tokens[i + 1];
                } else {
                    result = tokens[i - 1] - tokens[i + 1];
                }
                tokens.splice(i - 1, 3, result);
                i--;
            } else {
                i++;
            }
        }

        if (tokens.length !== 1 || typeof tokens[0] !== 'number') {
            throw new Error('Invalid expression');
        }

        return tokens[0];
    }
}

/**
 * Core arithmetic operations
 */
// PUBLIC_INTERFACE
const arithmetic = {
    /**
     * Adds two numbers
     * @param {number} a First number
     * @param {number} b Second number
     * @returns {number} Sum of the numbers
     */
    add: (a, b) => a + b,

    /**
     * Subtracts two numbers
     * @param {number} a First number
     * @param {number} b Second number
     * @returns {number} Difference of the numbers
     */
    subtract: (a, b) => a - b,

    /**
     * Multiplies two numbers
     * @param {number} a First number
     * @param {number} b Second number
     * @returns {number} Product of the numbers
     */
    multiply: (a, b) => a * b,

    /**
     * Divides two numbers
     * @param {number} a Numerator
     * @param {number} b Denominator
     * @returns {number} Quotient of the numbers
     * @throws {Error} If denominator is zero
     */
    divide: (a, b) => {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
};

/**
 * Trigonometric functions
 */
// PUBLIC_INTERFACE
const trigonometry = {
    /**
     * Calculates sine of an angle
     * @param {number} angle Angle in radians
     * @returns {number} Sine of the angle
     */
    sin: (angle) => Math.sin(angle),

    /**
     * Calculates cosine of an angle
     * @param {number} angle Angle in radians
     * @returns {number} Cosine of the angle
     */
    cos: (angle) => Math.cos(angle),

    /**
     * Calculates tangent of an angle
     * @param {number} angle Angle in radians
     * @returns {number} Tangent of the angle
     */
    tan: (angle) => Math.tan(angle),

    /**
     * Calculates inverse sine
     * @param {number} value Value between -1 and 1
     * @returns {number} Angle in radians
     * @throws {Error} If value is outside [-1, 1]
     */
    asin: (value) => {
        if (value < -1 || value > 1) throw new Error('Invalid input for asin');
        return Math.asin(value);
    },

    /**
     * Calculates inverse cosine
     * @param {number} value Value between -1 and 1
     * @returns {number} Angle in radians
     * @throws {Error} If value is outside [-1, 1]
     */
    acos: (value) => {
        if (value < -1 || value > 1) throw new Error('Invalid input for acos');
        return Math.acos(value);
    },

    /**
     * Calculates inverse tangent
     * @param {number} value Input value
     * @returns {number} Angle in radians
     */
    atan: (value) => Math.atan(value)
};

/**
 * Logarithmic and exponential functions
 */
// PUBLIC_INTERFACE
const logarithm = {
    /**
     * Calculates natural logarithm
     * @param {number} value Positive number
     * @returns {number} Natural logarithm of the value
     * @throws {Error} If value is non-positive
     */
    ln: (value) => {
        if (value <= 0) throw new Error('Invalid input for natural logarithm');
        return Math.log(value);
    },

    /**
     * Calculates base-10 logarithm
     * @param {number} value Positive number
     * @returns {number} Base-10 logarithm of the value
     * @throws {Error} If value is non-positive
     */
    log10: (value) => {
        if (value <= 0) throw new Error('Invalid input for logarithm');
        return Math.log10(value);
    },

    /**
     * Calculates exponential (e^x)
     * @param {number} value Exponent
     * @returns {number} e raised to the power of value
     */
    exp: (value) => Math.exp(value)
};

/**
 * Memory operations
 */
// PUBLIC_INTERFACE
const memory = {
    /**
     * Stores a value in memory
     * @param {number} value Value to store
     */
    store: (value) => {
        memoryValue = value;
    },

    /**
     * Recalls the value from memory
     * @returns {number|null} Stored value or null if memory is empty
     */
    recall: () => memoryValue,

    /**
     * Clears the memory
     */
    clear: () => {
        memoryValue = null;
    }
};

/**
 * Scientific notation utilities
 */
// PUBLIC_INTERFACE
const scientific = {
    /**
     * Converts a number to scientific notation string
     * @param {number} value Number to convert
     * @param {number} precision Number of decimal places (default: 6)
     * @returns {string} Number in scientific notation
     */
    format: (value, precision = 6) => {
        if (value === 0) return '0';
        
        let exp = Math.floor(Math.log10(Math.abs(value)));
        let mantissa = value / Math.pow(10, exp);
        
        return `${mantissa.toFixed(precision)}e${exp}`;
    },

    /**
     * Parses a scientific notation string
     * @param {string} value Scientific notation string
     * @returns {number} Parsed number
     * @throws {Error} If the string format is invalid
     */
    parse: (value) => {
        if (typeof value !== 'string') throw new Error('Input must be a string');
        
        const match = value.match(/^(-?\d*\.?\d+)e(-?\d+)$/i);
        if (!match) throw new Error('Invalid scientific notation format');
        
        const [, mantissa, exponent] = match;
        return Number(mantissa) * Math.pow(10, Number(exponent));
    }
};

module.exports = {
    evaluate: ExpressionEvaluator.evaluate.bind(ExpressionEvaluator),
    arithmetic,
    trigonometry,
    logarithm,
    memory,
    scientific
};
