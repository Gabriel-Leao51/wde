function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect('/401');
  }

  // baseUrl, not path: Express strips the mount prefix from req.path for
  // middleware registered through app.use('/admin', ...).
  if (req.baseUrl.startsWith('/admin') && !res.locals.isAdmin) {
    return res.redirect('/403');
  }

  next();
}

module.exports = protectRoutes;
