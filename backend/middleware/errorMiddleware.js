
const errorHandler = (err, req, res, next) => {
   
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

   
    console.error(err);

    // Check the environment
    const environment = process.env.NODE_ENV || 'production';

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: message,
        
        ...(environment === 'development' && { stack: err.stack }),
    });
};


export default errorHandler;

