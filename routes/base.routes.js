const express = require('express');

const { SUPPORTED_LANGUAGES } = require('../middlewares/locale');

const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/products');
});

router.get('/lang/:code', function(req, res) {
  if (SUPPORTED_LANGUAGES.includes(req.params.code)) {
    req.session.lang = req.params.code;
  }
  res.redirect(req.get('Referer') || '/');
});

router.get('/401', function(req, res) {
  res.status(401).render('shared/401');
});

router.get('/403', function(req, res) {
  res.status(403).render('shared/403');
});

module.exports = router;