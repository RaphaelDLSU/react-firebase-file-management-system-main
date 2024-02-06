const PDFDocument = require('pdfkit');
const fs = require('fs');

// class RFADocumentGenerator {
  // Function to generate RFA document
  // static generateRFADocument() {
  //   return new Promise((resolve, reject) => {
  //     try {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream('RFA_Document.pdf');

        doc.pipe(stream);

        // Add  Header
        doc.fontSize(24).text('Request for Approval (RFA)', { 
          align: 'center' 
        });
        doc.moveDown();

        // Add Body
        doc.fontSize(16).text('RFA Body', { 
          align: 'center' 
        });
        doc.moveDown();

        // Add Footer
        doc.fontSize(12).text('RFA Footer', { 
          align: 'center' 
        });

        // End the document
        doc.end();

        // Handle stream finish event to resolve the promise
//         stream.on('finish', () => {
//           resolve('RFA_Document.pdf');
//         });
//       } catch (error) {
//         // If an error occurs during document generation, reject the promise with the error
//         reject(error);
//       }
//     });
//   }
// }

// module.exports = RFADocumentGenerator;

