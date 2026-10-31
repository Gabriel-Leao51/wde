const fs = require('fs');

function handleErrors(error, req, res, next) {
  console.log(error);

  // A multipart upload is saved before csurf can check its token, so a rejected
  // request would otherwise leave the file behind.
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, function () {});
  }

  if (error.code === 404) {
    return res.status(404).render('shared/404');
  }

  res.status(500).render('shared/500');
}

module.exports = handleErrors;
