const PDFDocument = require("pdfkit");
const fs = require("fs");

// class RFIDocumentGenerator {
//   // Function to generate RFI document
//   static generateRFIDocument() {
//     return new Promise((resolve, reject) => {
//       try {
const doc = new PDFDocument();
const stream = fs.createWriteStream("RFI_Document_Template.pdf");

doc.pipe(stream);

doc
  .fontSize(20)
  .text("Request for Information (RFI)", { align: "center" })
  .moveDown();

doc.fontSize(12).text("Project Details:", { underline: true }).moveDown();

// Insert project details
const projectDetails = {
  Title: "Project ABC",
  Manager: "John Doe",
  Deadline: "March 31, 2024",
  To: "Mr.Bean",
  Attention: "Architect Lebron",
  CC: "Engr Kobe",
  // Add more project details here as needed
};

for (const [key, value] of Object.entries(projectDetails)) {
  doc.text(`${key}: ${value}`);
}

// Add space
doc.moveDown();

// Insert RFI details
doc.text("RFI Details:", { underline: true }).moveDown();

const rfiDetails = {
  RFINo: "RFI-001",
  dateRequested: "February 12, 2024",
  requestedBy: "Jane Smith",
  // Add more RFI details here as needed
};

for (const [key, value] of Object.entries(rfiDetails)) {
  doc.text(`${key}: ${value}`);
}

// Add space
doc.moveDown();

// Insert action items section
doc
  .fontSize(12)
  .text("Action Items:", { underline: true })
  .moveDown()
  .text("Please list the action items here:")
  .moveDown();

// Draw a dashed line above the action items section
doc
  .dash(5, { space: 5 })
  .moveTo(50, doc.y - 10)
  .lineTo(550, doc.y - 10)
  .stroke();

doc.moveDown().moveDown().moveDown();

// Draw checkboxes
const checkboxOptions = [
  { label: "Option 1", checked: false },
  { label: "Option 2", checked: true },
  { label: "Option 3", checked: false },
];

const checkboxSize = 15;
let currentY = doc.y;
checkboxOptions.forEach((option) => {
  drawCheckbox(50, currentY, checkboxSize, option.checked, option.label);
  currentY += checkboxSize + 10;
});

doc.moveDown();

// Add signature section
doc
  .fontSize(12)
  .text("Signature:", { underline: true })
  .moveDown()
  .text("Please sign below: [Signature Here]"); // Placeholder for signature

// Add space
doc.moveDown();

// Draw a dashed line below the signature section
doc
  .dash(5, { space: 5 })
  .moveTo(50, doc.y)
  .lineTo(550, doc.y)
  .stroke();

// Finalize PDF
doc.end();

// Function to draw a checkbox
function drawCheckbox(x, y, size, checked, label) {
  doc.save().translate(x, y).rect(0, 0, size, size).stroke();

  if (checked) {
    doc
      .moveTo(x, y)
      .lineTo(x + size, y + size)
      .stroke();
    doc
      .moveTo(x + size, y)
      .lineTo(x, y + size)
      .stroke();
  }

  // Add label text
  doc.fontSize(10).text(label, x + size + 10, y);

  doc.restore();
}

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
