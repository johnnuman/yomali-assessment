// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    // For the scope of this assessment, I have just outputted the error to console. In production setup, I would have
    // taken more serious steps of logging and handling error in a robust and detailed manner.
    console.error(err.stack);

    // Customize error response based on error type
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Check for specific error types (e.g., validation errors)
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors.map(e => e.message),  // Collect validation error messages
        });
    }

    // Send error response
    res.status(status).json({
        success: false,
        message,
        stack: undefined,
    });
};

module.exports = errorHandler;
