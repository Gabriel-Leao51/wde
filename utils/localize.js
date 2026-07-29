function localizeProduct(product, lang) {
  const translation = product.translations && product.translations[lang];

  if (!translation) {
    return product;
  }

  return {
    ...product,
    title: translation.title || product.title,
    summary: translation.summary || product.summary,
    description: translation.description || product.description,
  };
}

module.exports = { localizeProduct };
