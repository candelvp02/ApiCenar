export function Authorize(...roles) {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        const error = new Error('Forbidden. You do not have access to this resource.');
        error.statusCode = 403;
        throw error;
      }
      next();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 403;
      }
      next(err);
    }
  };
}