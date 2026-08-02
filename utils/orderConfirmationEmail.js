const transporter = require("../config/mailer");
const buildOrderSummary = require("./orderSummary");

async function sendOrderConfirmationEmail(order) {
  const summary = buildOrderSummary(order);

  const itemLines = summary.items
    .map(function (item) {
      return `${item.title} - $${item.unitPrice.toFixed(2)} x ${item.quantity} = $${item.lineTotal.toFixed(2)}`;
    })
    .join("\n");

  const text = [
    `Thank you for your order, ${summary.customer.name}!`,
    "",
    `Order ID: ${summary.orderId}`,
    `Date: ${summary.date}`,
    "",
    "Items:",
    itemLines,
    "",
    `Total: $${summary.totalPrice.toFixed(2)}`,
  ].join("\n");

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: summary.customer.email,
    subject: `WDE Shop - Order Confirmation (#${summary.orderId})`,
    text: text,
  });
}

module.exports = sendOrderConfirmationEmail;
