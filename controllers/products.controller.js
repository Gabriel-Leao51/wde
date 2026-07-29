const Product = require('../models/product.model');
const { localizeProduct } = require('../utils/localize');

async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    const localizedProducts = products.map(function (product) {
      return localizeProduct(product, res.locals.lang);
    });
    res.render('customer/products/all-products', { products: localizedProducts });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('customer/products/product-details', {
      product: localizeProduct(product, res.locals.lang),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails
};
