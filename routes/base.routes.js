const fs = require('fs');
const path = require('path');

const express = require('express');

const productsController = require('../controllers/products.controller');
const { SUPPORTED_LANGUAGES } = require('../middlewares/locale');

const router = express.Router();

// The image manifest is the licence record; the credits page is generated from it.
function readPhotoCredits() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'product-data', 'image-sources.json'), 'utf-8')
  );
  return manifest.map(function(entry) {
    return {
      title: entry.slug.split('-').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' '),
      pageUrl: entry.pageUrl,
      photographer: entry.photographer,
      photographerUrl: entry.photographerUrl,
      license: entry.license,
    };
  });
}

router.get('/', productsController.getHome);

router.get('/credits', function(req, res, next) {
  try {
    res.render('customer/credits', { credits: readPhotoCredits() });
  } catch (error) {
    next(error);
  }
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