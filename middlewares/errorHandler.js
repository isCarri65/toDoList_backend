// middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error(err); // Log interno para desarrolladores (importante en producción)

  let statusCode = 500; // Por defecto error interno del servidor
  let message = "Error interno del servidor";

  // Manejo de errores específicos de Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message =
      "Error de validación: " +
      Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
  }

  if (err.code === 11000) {
    // Código de error de duplicado de MongoDB
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue);
    message = `El valor para el campo '${field}' ya existe.`;
  }

  // Otros tipos de error personalizados
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
