const Product = require('../models/product.model');
const { localizeProduct } = require('../utils/localize');
const DEPARTMENTS = require('../utils/departments');

async function getAllProducts(req, res, next) {
  try {
    // req.query values can be arrays/objects (e.g. ?department[$ne]=null), not just
    // strings - only pass plain strings into the Mongo query, same discipline as the
    // login/signup NoSQL injection fix.
    const department = typeof req.query.department === 'string' ? req.query.department : undefined;
    const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;

    const products = await Product.findAll({ department, sort });
    const localizedProducts = products.map(function (product) {
      return localizeProduct(product, res.locals.lang);
    });
    res.render('customer/products/all-products', {
      products: localizedProducts,
      departments: DEPARTMENTS,
      selectedDepartment: department || '',
      selectedSort: sort || '',
    });
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
