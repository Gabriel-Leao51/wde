const stripeKey = process.env.STRIPE_KEY;

const stripe = require("stripe")(stripeKey);

const Order = require("../models/order.model");
const User = require("../models/user.model");
const buildOrderSummary = require("../utils/orderSummary");
const streamInvoicePdf = require("../utils/invoicePdf");
const sendOrderConfirmationEmail = require("../utils/orderConfirmationEmail");

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  let saveResult;
  try {
    saveResult = await order.save();
  } catch (error) {
    next(error);
    return;
  }

  order.id = saveResult.insertedId.toString();

  req.session.cart = null;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.items.map(function (item) {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.title,
            },
            unit_amount: item.product.price.toFixed(2) * 100,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.APP_URL}/orders/success?orderId=${order.id}`,
      cancel_url: `${process.env.APP_URL}/orders/failure`,
    });
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(303, session.url);
}

async function getSuccess(req, res) {
  const orderId = req.query.orderId;

  if (typeof orderId === "string") {
    try {
      const order = await Order.findById(orderId);
      if (order.userData._id.toString() === res.locals.uid) {
        await sendOrderConfirmationEmail(order);
      }
    } catch (error) {
      // The confirmation email is a best-effort convenience, not part of the
      // critical checkout path - a bad/missing order id or a transient SMTP
      // failure should never block the success page from rendering.
      console.error("Failed to send order confirmation email:", error);
    }
  }

  res.render("customer/orders/success");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

async function getInvoice(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id);
  } catch (error) {
    next(error);
    return;
  }

  if (order.userData._id.toString() !== res.locals.uid) {
    const error = new Error("Could not find order with provided id.");
    error.code = 404;
    next(error);
    return;
  }

  const summary = buildOrderSummary(order);
  streamInvoicePdf(summary, res);
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
  getInvoice: getInvoice,
};
