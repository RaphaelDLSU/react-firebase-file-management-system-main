const PDFDocument = require('pdfkit');
const fs = require('fs');

// class RFIDocumentGenerator {
//   // Function to generate RFI document
//   static generateRFIDocument() {
//     return new Promise((resolve, reject) => {
//       try {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream('RFI_Document_Template.pdf');

  doc.pipe(stream);

  doc.fontSize(20)
      .text('Request for Information (RFI)', { align: 'center' })
      .moveDown();
     
  doc.fontSize(12)
      .text('Project Details:', { underline: true })
      .moveDown();
     
  // Insert project details
  const projectDetails = {
    Title: 'Project ABC',
    Manager: 'John Doe',
    Deadline: 'March 31, 2024',
    To: 'Mr.Bean',
    Attention:'Architect Lebron',
    CC: 'Engr Kobe'
    // Add more project details here as needed
    };
     
    for (const [key, value] of Object.entries(projectDetails)) {
        doc.text(`${key}: ${value}`);
     }
     
    // Add space
    doc.moveDown();
     
    // Insert RFI details
    doc.text('RFI Details:', { underline: true }).moveDown();
     
    const rfiDetails = {
        RFINo: 'RFI-001',
        dateRequested: 'February 12, 2024',
        requestedBy: 'Jane Smith',
        // Add more RFI details here as needed
    };

    for (const [key, value] of Object.entries(rfiDetails)) {
      doc.text(`${key}: ${value}`);
   }

    doc.moveDown();
     
    // Insert RFI Description
    doc.text('RFI Description:', { underline: true }).moveDown();
    doc.text(`Please provide information regarding...`);
     
     // Finalize PDF
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
