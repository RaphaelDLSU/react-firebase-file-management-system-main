const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to generate RFI document
function generateRFIDocument() {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Create a writable stream to RFI_Document.pdf
  const stream = fs.createWriteStream('RFI_Document.pdf');

  // Pipe the PDF document to the stream
  doc.pipe(stream);

  // Add RFI header
  doc.fontSize(24).text('Request for Information (RFI)', { align: 'center' });
  doc.moveDown();

  // Add RFI body
  doc.fontSize(16).text('RFI Body', { align: 'center' });
  doc.moveDown();

  // Add RFI footer
  doc.fontSize(12).text('RFI Footer', { align: 'center' });

  // End the document
  doc.end();
}

module.exports = generateRFIDocument; 