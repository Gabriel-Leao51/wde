const THEMES = ['light', 'dark'];

function themeMiddleware(req, res, next) {
  // Plain cookie, not the session: the test suite shares one server session per saved login.
  const match = /(?:^|;\s*)theme=([^;]*)/.exec(req.headers.cookie || '');
  res.locals.theme = match && THEMES.includes(match[1]) ? match[1] : null;
  next();
}

module.exports = themeMiddleware;
module.exports.THEMES = THEMES;
