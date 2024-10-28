const { check, validationResult } = require('express-validator');

// Validation rules for creating a new session
const validateSession = [
    check('user_id').notEmpty().withMessage('User ID is required'),
    check('page_id').isInt({ min: 1 }).withMessage('Page ID must be a positive integer'),
    check('browser_id').isInt({ min: 1 }).withMessage('Browser ID must be a positive integer'),
    check('os_id').isInt({ min: 1 }).withMessage('Operating System ID must be a positive integer'),
    check('device_type_id').isInt({ min: 1 }).withMessage('Device Type ID must be a positive integer'),
    check('geo_id').isInt({ min: 1 }).withMessage('Geolocation ID must be a positive integer'),
    check('ip_address').isIP().withMessage('Invalid IP address format'),

    // Middleware to handle validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(), // Return an array of validation error messages
            });
        }
        next(); // If validation passes, move to the next middleware/controller
    }
];

module.exports = validateSession;
