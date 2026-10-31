const protectRoutes = require('./protect-routes');
const imageUpload = require('./image-upload');

// csurf runs before the routes, but multer is what parses a multipart body, so
// a token in a hidden form field is invisible to csurf until multer has run.
// Parse admin product uploads first - only for signed-in admins - so the token
// can live in the form body instead of the URL.
function parseAdminMultipart(req, res, next) {
  if (!req.is('multipart/form-data')) {
    return next();
  }

  protectRoutes(req, res, function (error) {
    if (error) {
      return next(error);
    }
    imageUpload(req, res, next);
  });
}

module.exports = parseAdminMultipart;
