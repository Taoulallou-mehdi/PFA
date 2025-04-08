const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    let statusCode = err.status || 500;
    let message = err.message || "Erreur interne du serveur";
    
    // Erreur spécifique MongoDB : ID invalide
    if (err.name === "CastError") {
        statusCode = 400;
        message = "ID invalide fourni.";
    }
    
    // Erreur de validation MongoDB
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    
    res.status(statusCode).json({ 
        success: false, 
        message 
    });
};

const notFoundHandler = (req, res, next) => {
    const error = new Error(`La route ${req.originalUrl} n'existe pas.`);
    error.status = 404;
    next(error); 
};

module.exports = { errorHandler, notFoundHandler };

