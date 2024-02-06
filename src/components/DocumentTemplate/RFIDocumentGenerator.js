const PDFDocument = require('pdfkit');
const fs = require('fs');

// class RFIDocumentGenerator {
//   // Function to generate RFI document
//   static generateRFIDocument() {
//     return new Promise((resolve, reject) => {
//       try {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream('RFI_Document.pdf');

        doc.pipe(stream);

        // Add content to the RFI document
        // Add Header
        doc.fontSize(24).text('Request for Information (RFI)', { 
          align: 'center' 
        });
        doc.moveDown();

        // Add Body
        doc.fontSize(16).text('RFI Body', { 
          align: 'center' 
        });
        doc.moveDown();

        // Add Footer
        doc.fontSize(12).text('RFI Footer', { 
          align: 'center' 
        });

        // End the document
        doc.end();

//         // Handle stream finish event to resolve the promise
//         stream.on('finish', () => {
//           resolve('RFI_Document.pdf');
//         });
//       } catch (error) {
//         // If an error occurs during document generation, reject the promise with the error
//         reject(error);
//       }
//     });
//   }
// }

// module.exports = RFIDocumentGenerator;
