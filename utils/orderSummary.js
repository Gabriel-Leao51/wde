// Normalizes an Order model instance into plain data, shared by anything
// that needs to present order contents outside the admin/customer order
// list views - the PDF invoice (utils/invoicePdf.js) today, and the order
// confirmation email planned for Phase 10 Track 6b.
function buildOrderSummary(order) {
  return {
    orderId: order.id,
    date: order.formattedDate,
    status: order.status,
    customer: {
      name: order.userData.name,
      email: order.userData.email,
      address: order.userData.address,
    },
    items: order.productData.items.map(function (item) {
      return {
        title: item.product.title,
        unitPrice: item.product.price,
        quantity: item.quantity,
        lineTotal: item.totalPrice,
      };
    }),
    totalQuantity: order.productData.totalQuantity,
    totalPrice: order.productData.totalPrice,
  };
}

module.exports = buildOrderSummary;
