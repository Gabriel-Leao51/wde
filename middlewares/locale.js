const fs = require('fs');
const path = require('path');

const SUPPORTED_LANGUAGES = ['en', 'pt'];
const DEFAULT_LANGUAGE = 'en';

const dictionaries = {};
for (const lang of SUPPORTED_LANGUAGES) {
  dictionaries[lang] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'locales', `${lang}.json`), 'utf-8')
  );
}

function resolveKey(dictionary, key) {
  return key.split('.').reduce(function (value, segment) {
    return value && typeof value === 'object' ? value[segment] : undefined;
  }, dictionary);
}

function localeMiddleware(req, res, next) {
  const lang = SUPPORTED_LANGUAGES.includes(req.session.lang) ? req.session.lang : DEFAULT_LANGUAGE;
  const dictionary = dictionaries[lang];

  res.locals.lang = lang;
  res.locals.t = function (key) {
    const value = resolveKey(dictionary, key);
    return typeof value === 'string' ? value : key;
  };

  next();
}

module.exports = localeMiddleware;
module.exports.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
module.exports.DEFAULT_LANGUAGE = DEFAULT_LANGUAGE;
