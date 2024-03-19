
async function createRFI() {

  
    // Create a new PDFDocument
    const formUrl = "https://firebasestorage.googleapis.com/v0/b/italpinas-dms.appspot.com/o/files%2FlgyVDEoMlPhvBFyi4y8a4rIFAoM2%2FRFI_Template.pdf?alt=media&token=562028d5-e7ad-4b77-82ae-c14ccae6abba";
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

    //Load PDF
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    //Get Form
    const form = pdfDoc.getForm();

    //Get all fields
    const rfiField = form.getTextField("rfi");
    const dateField = form.getTextField("Date1");
    const submitToField = form.getTextField("Submitted_To");
    const neededByField = form.getTextField("Needed_By");
    const projectNameField = form.getTextField("Project_Name");
    const projectNumberField = form.getTextField("Project_Number");
    const submitByField = form.getTextField("Submitted_By");
    const rfiDescriptionField = form.getTextField("RFI_Desc");
    const submitByField2 = form.getTextField("Submitted_By_2");
    const responseDescriptionField = form.getTextField("Response_Desc");
    const dateField2 = form.getTextField("Date2");
    const responseByField = form.getTextField("Response_By");
    const attachmentButton = form.getButton("Attachment");

    //Creating variables
    const actualRFI = {};
    const actualDate = {};
    const actualSubmitTo = {};
    const actualNeededBy = {};
    const actualProjectName = {};
    const actualProjectNumber = {};
    const actualSubmitBy = {};
    const actualSubmitBy2 = {};
    const actualDate2 = {};
    const actualResponseBy = {};

    //Fill in basic fields
    rfiField.setText("RFI-1");
    dateField.setText("01/01/2022");
    submitToField.setText("John Doe");
    neededByField.setText("01/01/2023");
    projectNameField.setText("Project 1");
    projectNumberField.setText("12345");
    submitByField.setText("Jane Doe");
    rfiDescriptionField.setText("Description 1");
    submitByField2.setText("Jane Doe");
    responseDescriptionField.setText("Description 2");
    dateField2.setText("01/01/2022");
    responseByField.setText("John Doe");

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };
  
  export default createRFI;