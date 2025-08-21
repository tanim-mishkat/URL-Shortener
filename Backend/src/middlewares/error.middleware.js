export const globalErrorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR :', err);
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
