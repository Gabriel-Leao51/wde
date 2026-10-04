const Product = require('../models/product.model');
const Order = require('../models/order.model');
const DEPARTMENTS = require('../utils/departments');
const sanitizeDescription = require('../utils/sanitizeDescription');

// The admin list's own search: a case-insensitive match on the product's name (English or
// Portuguese) or its department, by key or by the label shown in the current language.
function matchesAdminSearch(product, query, t) {
  const needle = query.toLowerCase();
  const haystack = [product.title, product.translations?.pt?.title, product.department];
  if (product.department) {
    haystack.push(t('departments.' + product.department));
  }
  return haystack.some(function (text) {
    return typeof text === 'string' && text.toLowerCase().includes(needle);
  });
}

async function getProducts(req, res, next) {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  try {
    const allProducts = await Product.findAll();
    const products = query
      ? allProducts.filter(function (product) {
          return matchesAdminSearch(product, query, res.locals.t);
        })
      : allProducts;

    res.render('admin/products/all-products', {
      products: products,
      totalCount: allProducts.length,
      query: query,
    });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  res.render('admin/products/new-product', { departments: DEPARTMENTS });
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    description: sanitizeDescription(req.body.description),
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product: product, departments: DEPARTMENTS });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  let product;
  try {
    const existingProduct = await Product.findById(req.params.id);
    product = new Product({
      ...req.body,
      _id: req.params.id,
      description: sanitizeDescription(req.body.description),
      // The edit form has no translation fields, so req.body never carries
      // `translations` - without this, every edit would silently wipe out
      // any localized copy already stored for the product.
      translations: existingProduct.translations,
    });
  } catch (error) {
    next(error);
    return;
  }

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};
