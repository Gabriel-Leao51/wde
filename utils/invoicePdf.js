const PDFDocument = require('pdfkit');

function streamInvoicePdf(summary, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${summary.orderId}.pdf"`);

  doc.pipe(res);

  doc.fontSize(20).text('WDE Shop - Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Order ID: ${summary.orderId}`);
  doc.text(`Date: ${summary.date}`);
  doc.text(`Status: ${summary.status}`);
  doc.moveDown();

  doc.text('Billed to:');
  doc.text(summary.customer.name);
  doc.text(summary.customer.email);
  doc.text(summary.customer.address.street);
  doc.text(`${summary.customer.address.postalCode} ${summary.customer.address.city}`);
  doc.moveDown();

  doc.text('Items:');
  summary.items.forEach(function (item) {
    doc.text(`${item.title} - $${item.unitPrice.toFixed(2)} x ${item.quantity} = $${item.lineTotal.toFixed(2)}`);
  });
  doc.moveDown();

  doc.fontSize(14).text(`Total: $${summary.totalPrice.toFixed(2)}`, { align: 'right' });

  doc.end();
}

module.exports = streamInvoicePdf;
