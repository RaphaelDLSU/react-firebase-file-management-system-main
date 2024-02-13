import {
  faFileImage,
  faFileAlt,
  faFileAudio,
  faFileVideo,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./index.css";

import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";

import {
  getAdminFiles,
  getAdminFolders,
  getUserFiles,
  getUserFolders,
} from "../../../redux/actionCreators/filefoldersActionCreators";
import SubNav from "../SubNav.js";

const Home = () => {
  const [myState, setMyState] = useState([]);

  const db = getFirestore();

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleDeleteFolder = async (docId) => {
    await deleteDoc(doc(db, "docs", docId)).then((result) =>
      setMyState(result)
    );
    toast.success("Folder deleted Successfully!");
  };

  const handleDeleteFile = async (docId) => {
    await deleteDoc(doc(db, "files", docId)).then((result) =>
      setMyState(result)
    );
    toast.success("File deleted Successfully!");
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading, adminFolders, allUserFolders, userId, allUserFiles } =
    useSelector(
      (state) => ({
        isLoading: state.filefolders.isLoading,
        adminFolders: state.filefolders.adminFolders,
        allUserFolders: state.filefolders.userFolders,
        allUserFiles: state.filefolders.userFiles,
        userId: state.auth.userId,
      }),
      shallowEqual
    );

  const userFolders =
    allUserFolders &&
    allUserFolders.filter((folder) => folder.data.parent === "");

  const createdUserFiles =
    allUserFiles &&
    allUserFiles.filter(
      (file) => file.data.parent === "" && file.data.url === ""
    );
  const uploadedUserFiles =
    allUserFiles &&
    allUserFiles.filter(
      (file) => file.data.parent === "" && file.data.url !== ""
    );

  const [list1, setList1] = useState(userFolders);
  const [list2, setList2] = useState(createdUserFiles);
  const [list3, setList3] = useState(uploadedUserFiles);

  useEffect(() => {
    if (isLoading && !adminFolders) {
      dispatch(getAdminFolders());
      dispatch(getAdminFiles());
    }
    if (!userFolders) {
      dispatch(getUserFiles(userId));
      dispatch(getUserFolders(userId));
      console.log("inside2: " + userFolders + "here: " + userId);
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (list1 == null && list2 == null && list3 == null) {
      setList1(userFolders);
      setList2(createdUserFiles);
      setList3(uploadedUserFiles);

      console.log(userFolders);
      console.log(createdUserFiles);
      console.log(uploadedUserFiles);
    }
  }, [userFolders]);

  async function createPDF() {
    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([600, 400]); // Specify page width and height
    const form = pdfDoc.getForm();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.setFont(helveticaFont);
    page.setFontSize(10);

    // Rest of the code...
    page.drawText("Request For Information (RFI)", {
      x: 230,
      y: 380,
      color: rgb(0, 0, 0),
      fontSize: 20,
    });

    // Draw RFI fields
    page.drawText("RFI #:", { x: 50, y: 340 });
    const rfiField = form.createTextField("rfiField");
    rfiField.setText("RFI-001");
    rfiField.addToPage(page, {
      x: 100,
      y: 340,
      width: 70,
      height: 12,
      fontSize: 10,
    });
    rfiField.enableReadOnly();

    page.drawText("DATE:", { x: 50, y: 320 });
    const dateField = form.createTextField("dateField");
    dateField.setText("2021-01-01");
    dateField.addToPage(page, {
      x: 100,
      y: 320,
      width: 70,
      height: 12,
      fontSize: 10,
    });
    dateField.enableReadOnly();

    // Draw RFI description
    page.drawText("RFI DESCRIPTION", { x: 50, y: 300 });
    const descriptionField = form.createTextField("descriptionField");
    descriptionField.setText(
      "Please provide the specifications for the concrete to be used in the foundation."
    );
    descriptionField.addToPage(page, {
      x: 50,
      y: 260,
      width: 500,
      height: 35,
      fontSize: 10,
    });

    // Draw attachments section
    page.drawText("ATTACHMENTS:", { x: 50, y: 240 });
    const attachmentButton = form.createButton("attachmentButton");
    attachmentButton.addToPage("Attach File", page, {
      x: 50,
      y: 210,
      width: 100,
      height: 20,
      backgroundColor: rgb(0.95, 0.95, 0.95),
      borderColor: rgb(0.7, 0.7, 0.7),
    });

    // Draw response section
    page.drawText("RESPONSE TO RFI", { x: 50, y: 180 });
    const responseField = form.createTextField("responseField");
    responseField.setText(
      "Please provide the specifications for the concrete to be used in the foundation."
    );
    responseField.addToPage(page, {
      x: 50,
      y: 140,
      width: 500,
      height: 35,
      fontSize: 10,
    });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    const filteredList1 = userFolders.filter((item) =>
      item.data.name
        .toString()
        .toLowerCase()
        .includes(searchTerm.toString().toLowerCase())
    );

    const filteredList2 = createdUserFiles.filter((item) =>
      item.data.name
        .toString()
        .toLowerCase()
        .includes(searchTerm.toString().toLowerCase())
    );

    const filteredList3 = uploadedUserFiles.filter((item) =>
      item.data.name
        .toString()
        .toLowerCase()
        .includes(searchTerm.toString().toLowerCase())
    );

    setList1(filteredList1);
    setList2(filteredList2);
    setList3(filteredList3);
  };
  if (isLoading && !userFolders) {
    return (
      <Row>
        <Col md="12">
          <h1 className="text-center my-5">Fetching folders...</h1>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <button onClick={createPDF}>Create RFI</button>

      <SubNav currentFolder="root folder" />
      {adminFolders && adminFolders.length > 0 && (
        <>
          <p className="text-center border-bottom py-2">Admin Folders</p>
          <Row style={{ height: "150px" }} className="pt-2 pb-4 px-5">
            {adminFolders.map(({ data, docId }) => (
              <Col
                onDoubleClick={() =>
                  history.push(`/dashboard/folder/admin/${docId}`)
                }
                onClick={(e) => {
                  if (e.currentTarget.classList.contains("text-white")) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.classList.remove("text-white");
                    e.currentTarget.classList.remove("shadow-sm");
                  } else {
                    e.currentTarget.style.background = "#017bf562";
                    e.currentTarget.classList.add("text-white");
                    e.currentTarget.classList.add("shadow-sm");
                  }
                }}
                key={docId}
                md={2}
                className="item"
              >
                <FontAwesomeIcon
                  icon={faFolder}
                  className="mt-3"
                  style={{ fontSize: "3rem" }}
                />
                <p className="text-center mt-3">{data.name}</p>
              </Col>
            ))}
          </Row>
        </>
      )}
      {userFolders && userFolders.length > 0 && list1 && list1.length > 0 && (
        <>
          <p className="text-center border-bottom py-2">Created Folders</p>
          <Row style={{ height: "auto" }} className={`pt-2 gap-2 pb-4 px-5`}>
            {list1.map(({ data, docId }) => (
              <Col
                onDoubleClick={() => history.push(`/dashboard/folder/${docId}`)}
                onClick={(e) => {
                  if (e.currentTarget.classList.contains("text-white")) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.classList.remove("text-white");
                    e.currentTarget.classList.remove("shadow-sm");
                  } else {
                    e.currentTarget.style.background = "#017bf562";
                    e.currentTarget.classList.add("text-white");
                    e.currentTarget.classList.add("shadow-sm");
                  }
                }}
                key={docId}
                md={2}
                className="item"
                onMouseEnter={() => handleMouseEnter(docId)}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredItem === docId && (
                  <button onClick={() => handleDeleteFolder(docId)}>
                    Delete
                  </button>
                )}
                <FontAwesomeIcon
                  icon={faFolder}
                  className="mt-3"
                  style={{ fontSize: "3rem" }}
                />
                <p className="text-center mt-3">{data.name}</p>
              </Col>
            ))}
          </Row>
        </>
      )}
      {createdUserFiles &&
        createdUserFiles.length > 0 &&
        list2 &&
        list2.length > 0 && (
          <>
            <p className="text-center border-bottom py-2">Created Files</p>
            <Row style={{ height: "auto" }} className="pt-2 gap-2 pb-4 px-5">
              {list2.map(({ data, docId }) => (
                <Col
                  onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                  onClick={(e) => {
                    if (e.currentTarget.classList.contains("text-white")) {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.classList.remove("text-white");
                      e.currentTarget.classList.remove("shadow-sm");
                    } else {
                      e.currentTarget.style.background = "#017bf562";
                      e.currentTarget.classList.add("text-white");
                      e.currentTarget.classList.add("shadow-sm");
                    }
                  }}
                  key={docId}
                  md={2}
                  className="item"
                  onMouseEnter={() => handleMouseEnter(docId)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hoveredItem === docId && (
                    <button onClick={() => handleDeleteFile(docId)}>
                      Click me!
                    </button>
                  )}
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="mt-3"
                    style={{ fontSize: "3rem" }}
                  />
                  <p className="text-center mt-3">{data.name}</p>
                </Col>
              ))}
            </Row>
          </>
        )}
      {uploadedUserFiles &&
        uploadedUserFiles.length > 0 &&
        list3 &&
        list3.length > 0 && (
          <>
            <p className="text-center border-bottom py-2">Uploaded Files</p>
            <Row
              md="2"
              style={{ height: "auto" }}
              className="pt-2  gap-2 pb-4 px-5"
            >
              {list3.map(({ data, docId }) => (
                <Col
                  onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                  onClick={(e) => {
                    if (e.currentTarget.classList.contains("text-white")) {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.classList.remove("text-white");
                      e.currentTarget.classList.remove("shadow-sm");
                    } else {
                      e.currentTarget.style.background = "#017bf562";
                      e.currentTarget.classList.add("text-white");
                      e.currentTarget.classList.add("shadow-sm");
                    }
                  }}
                  key={docId}
                  md={2}
                  className="item"
                  onMouseEnter={() => handleMouseEnter(docId)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hoveredItem === docId && (
                    <button onClick={() => handleDeleteFile(docId)}>
                      Click me!
                    </button>
                  )}
                  <FontAwesomeIcon
                    icon={
                      data.name
                        .split(".")
                        [data.name.split(".").length - 1].includes("png") ||
                      data.name
                        .split(".")
                        [data.name.split(".").length - 1].includes("jpg") ||
                      data.name
                        .split(".")
                        [data.name.split(".").length - 1].includes("jpeg") ||
                      data.name
                        .split(".")
                        [data.name.split(".").length - 1].includes("svg") ||
                      data.name
                        .split(".")
                        [data.name.split(".").length - 1].includes("gif")
                        ? faFileImage
                        : data.name
                            .split(".")
                            [data.name.split(".").length - 1].includes("mp4") ||
                          data.name
                            .split(".")
                            [data.name.split(".").length - 1].includes("mpeg")
                        ? faFileVideo
                        : data.name
                            .split(".")
                            [data.name.split(".").length - 1].includes("mp3")
                        ? faFileAudio
                        : faFileAlt
                    }
                    className="mt-3"
                    style={{ fontSize: "3rem" }}
                  />
                  <p className="text-center mt-3">{data.name}</p>
                </Col>
              ))}
            </Row>
          </>
        )}
    </>
  );
};

export default Home;
