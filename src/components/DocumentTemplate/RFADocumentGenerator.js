const PDFDocument = require("pdfkit");
const fs = require("fs");

// class RFADocumentGenerator {
// Function to generate RFA document
// static generateRFADocument() {
//   return new Promise((resolve, reject) => {
//     try {
const doc = new PDFDocument();
const stream = fs.createWriteStream("RFA_Document_Template.pdf");

doc.pipe(stream);

doc
  .fontSize(20)
  .text("Request for Action (RFA)", { align: "center" })
  .moveDown();

// Set up the project details
doc.fontSize(12).text("Project Details:", { underline: true }).moveDown();

const projectDetails = {
  projectTitle: "Project ABC",
  projectManager: "John Doe",
  projectDeadline: "March 31, 2024",
  // Add more project details here as needed
};

for (const [key, value] of Object.entries(projectDetails)) {
  doc.text(`${key}: ${value}`);
}

// Add space
doc.moveDown();

// Set up the RFA details
doc.fontSize(12).text("RFA Details:", { underline: true }).moveDown();

const rfaDetails = {
  rfaNumber: "RFA-001",
  dateRequested: "February 12, 2024",
  requestedBy: "Jane Smith",
  // Add more RFA details here as needed
};

for (const [key, value] of Object.entries(rfaDetails)) {
  doc.text(`${key}: ${value}`);
}

// Add space
doc.moveDown();

// Insert file attachment section
doc
  .fontSize(12)
  .text("File Attachment:", { underline: true })
  .moveDown()
  .text("Attached File Name: [File Name Here]") // Placeholder for file name
  .moveDown()
  .text("Attached File Description: [Description Here]"); // Placeholder for file description

// Add space
doc.moveDown();

// Insert action items section
doc
  .fontSize(12)
  .text("Action Items:", { underline: true })
  .moveDown()
  .text("Please list the action items here:")
  .moveDown();

doc.moveDown().moveDown().moveDown().moveDown().moveDown();

// Add signature section
doc
  .fontSize(12)
  .text("Signature:", { underline: true })
  .moveDown()
  .text("Please sign below: [Signature Here]"); // Placeholder for signature

// Finalize PDF
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
