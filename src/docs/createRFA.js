
async function createRFA() {

  const formUrl = "https://firebasestorage.googleapis.com/v0/b/italpinas-dms.appspot.com/o/files%2FlgyVDEoMlPhvBFyi4y8a4rIFAoM2%2FRFA_Template.pdf?alt=media&token=24cc79ed-b940-45bf-a0ac-5895cd6a23c4";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

  //Load PDF
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  //Get Form
  const form = pdfDoc.getForm();

  //Get all fields
  const fields = form.getFields();
  fields.forEach((field) => {
    const type = field.constructor.name;
    const name = field.getName();
    field.enableReadOnly();
    console.log(`${type}: ${name}`);
  });
  // const submitalID = form.getTextField("Submittal_ID");
  // const projectID = form.getTextField("Project_ID");
  // const projectName = form.getTextField("Project_Name");
  // const date = form.getTextField("Date");
  //Creating variables

  //Fill in basic fields

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export default createRFA;