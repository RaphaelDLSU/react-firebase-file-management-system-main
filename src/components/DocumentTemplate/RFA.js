const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to generate RFA document
function generateRFADocument() {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Create a writable stream to RFA_Document.pdf
  const stream = fs.createWriteStream('RFA_Document.pdf');

  // Pipe the PDF document to the stream
  doc.pipe(stream);

  // Add RFA header
  doc.fontSize(24).text('Request for Approval (RFA)', { align: 'center' });
  doc.moveDown();

  // Add RFA body
  doc.fontSize(16).text('RFA Body', { align: 'center' });
  doc.moveDown();

  // Add RFA footer
  doc.fontSize(12).text('RFA Footer', { align: 'center' });

  // End the document
  doc.end();
}

module.exports = generateRFADocument();
