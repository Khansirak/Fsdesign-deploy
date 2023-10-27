import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import { Document, Page, pdfjs } from "react-pdf";
import BackerHicksLogoPDF from "../images/BackerHicksLogoPDF.PNG";
import ClientLogoPDF from "../images/ClientLogoPDF.PNG";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import { Document, Page, Image, StyleSheet } from '@react-pdf/renderer';
// import PDFDocument from './PDFDocument';
import { BlobProvider } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { Link, useParams } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFPreview = () => {
  const storedData = localStorage.getItem("fetchedData");
  const parsedData = JSON.parse(storedData);
  // const id="65032d080f2c9334960dbea9";
  const { id } = useParams();
  const desiredRecipe = parsedData.recipe.find((recipe) => recipe.id === id);
  const generateRandomData = (rowCount, columnCount) => {
    const data = [];
    // Create an array of keys from table1
    const keys = Object.keys(
      desiredRecipe?.parameterTables?.parameterData?.table1
    );
    console.log(keys);
    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (let j = 0; j < columnCount; j++) {
        // Randomly select a key from the keys array
        const randomIndex = i * columnCount + j;
        const randomKey = keys[randomIndex];

        // Push the corresponding value to the row
        row.push(
          desiredRecipe?.parameterTables?.parameterData?.table1?.[randomKey] ||
            ""
        );
      }
      data.push(row);
    }
    return data;
  };
  const generateRandomDataS = (rowCount, columnCount) => {
    const data = [];
    // Create an array of keys from table1
    const keys = Object.keys(
      desiredRecipe?.signalData?.signalData?.table1 || {}
    );
    console.log(keys);
    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (let j = 0; j < columnCount; j++) {
        // Randomly select a key from the keys array
        const randomIndex = i * columnCount + j;
        const randomKey = keys[randomIndex];

        // Push the corresponding value to the row
        row.push(
          desiredRecipe?.signalData?.signalData?.table1?.[randomKey] || ""
        );
      }
      data.push(row);
    }
    return data;
  };
  const generateRandomDataA = (rowCount, columnCount) => {
    const data = [];
    // Create an array of keys from table1
    const keys = Object.keys(
      desiredRecipe?.alarmPropsData?.alarmpropsData?.table1 || {}
    );
    console.log(keys);
    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (let j = 0; j < columnCount; j++) {
        // Randomly select a key from the keys array
        const randomIndex = i * columnCount + j;
        const randomKey = keys[randomIndex];

        // Push the corresponding value to the row
        row.push(
          desiredRecipe?.alarmPropsData?.alarmpropsData?.table1?.[randomKey] ||
            ""
        );
      }
      data.push(row);
    }
    return data;
  };

  const [pdfData, setPdfData] = useState(null);
  const pdfRef = useRef();
  const handleGeneratePDF = () => {
    ////MAIN PAGE
    const doc = new jsPDF();
    function addHeader() {
      doc.setFontSize(40); // Set the font size for the header
      doc.setFont("helvetica", "bold"); // Set the font family and style to bold
      doc.text("FUNKTIONSSPEZIFIKATION", 10, 40); // Adjust the position as needed
      doc.setFont("helvetica", "normal"); // Reset font style to normal
    }
    function addSubHeader() {
      doc.setFontSize(30); // Set the font size for the header
      doc.setFont("helvetica", "bold"); // Set the font family and style to bold
      doc.text("PHASEXX", 10, 60); // Adjust the position as needed
      doc.setFont("helvetica", "normal"); // Reset font style to normal
    }

    addHeader();
    addSubHeader();
    // Left Logo

    doc.addImage(BackerHicksLogoPDF, "PNG", 10, 90, 80, 55); // Adjust the position and dimensions as needed

    // Right Logo

    doc.addImage(
      ClientLogoPDF,
      "PNG",
      doc.internal.pageSize.getWidth() - 80,
      90,
      80,
      55
    ); // Adjust the position and dimensions as needed

    // Define your table data
    const tableData = [
      ["Projekt Titel", "PLEX"],
      ["Projektnummer (Kunde)", "Pas2021_001"],
      ["Bakerhicks Projektnummer", "AT-213575-001"],
      ["Dokumententype", "Funktionsspezifikation"],
      ["Bereich", "Automatisierung"],
      ["Projekt Dokumentennummer", "Pas2021_001-01-Rev206_V01.2"],
    ];

    // Create the table
    doc.autoTable({
      body: tableData,
      startY: 220, // Set the Y coordinate for the table
      margin: { left: 10, right: 10 }, // Set margins to center the table horizontally
      tableWidth: "auto",
    });
    //////////////nEW PAGE
    doc.addPage();
    const tableData2 = [
      [
        {
          content: "Authored by",
          styles: {
            fontStyle: "bold",
            fontSize: 16,
            border: [true, true, true, true],
          },
        },
        {
          content: "Date/Name/Signum",
          styles: { fontStyle: "bold", fontSize: 16 },
        },
      ],
      [
        "Department: Automation (BAH) Responsibility: The requirements in this protocol represent the business needs and manufacturing requirements of the site to be served by this equipment or system. This document is technically sound with respect to the operation or use of the equipment",
        "",
      ],
      [
        {
          content: "Reviewed by",
          styles: {
            fontStyle: "bold",
            fontSize: 16,
            border: [true, true, true, true],
          },
        },
        {
          content: "Date/Name/Signum",
          styles: { fontStyle: "bold", fontSize: 16 },
        },
      ],
      [
        "Department: Process (BAH) Responsibility: The requirements in this protocol represent the business needs and manufacturing requirements of the site to be served by this equipment or system. This document is technically sound with respect to the operation or use of the equipment.",
        "",
      ],
      [
        {
          content: "Approved by",
          styles: {
            fontStyle: "bold",
            fontSize: 16,
            border: [true, true, true, true],
          },
        },
 
        {
          content: "Date/Name/Signum",
          styles: { fontStyle: "bold", fontSize: 16 },
        },
      ],
      [
        "Department: Manufacturing Engineering (CYT) Responsibility: The requirements in this protocol represent the business needs and manufacturing requirements of the site to be served by this equipment or system. This document is technically sound with respect to the operation or use of the equipment",
        "",
      ],
      [
        "Department: Quality Engineering (CYT) Responsibility: The requirements in this protocol represent the business needs and manufacturing requirements of the site to be served by this equipment or system. This document is technically sound with respect to the operation or use of the equipment.",
        "",
      ],
      [
        "Department: Quality Assurance (CYT) Responsibility: This document is in compliance with current local GMP- regulatory requirements and conforms to the applicable Cell Culture quality standards and work instruction documents.  Equipment satisfying these qualification and validation requirements will be suitable for its intended use.",
        "",
      ],
    ];

    doc.autoTable({
      body: tableData2,
      startY: 25, // Set the Y coordinate for the table
      margin: { left: 10, right: 10 }, // Set margins to center the table horizontally
      tableWidth: "auto",
      tableLineColor: [0, 0, 0], // Border color (black in RGB)
      tableLineWidth: 0.4,
    });
    ///////////////////NEW PAGE
    // Add a new page
    doc.addPage();

    ////Parameters
    doc.setFontSize(12);
    doc.text(" Prozessparameter", 10, 10);
    const paramC =
      desiredRecipe?.parameterTables?.parameterData?.table1?.parametColumn || 1;
    const paramR =
      desiredRecipe?.parameterTables?.parameterData?.table1?.parametRow || 1;
    const data = generateRandomData(paramR, paramC);
    // Define the table headers

    function customizeRow(row, data) {
      if (row.index === 0) {
        // First row (index 0) will have gray background color
        row.styles.fillColor = [200, 250, 200]; // RGB color for gray
      }
    }
    doc.autoTable({
      body: data,
      didDrawRow: customizeRow,
    });

    const startY = doc.autoTable.previous.finalY + 20; // Move the second table 20 units down

    //////Ssignals

    doc.text("Schnittstellensignale", 10, startY);
    const paramCS =
      desiredRecipe?.signalData?.signalData?.table1?.parametColumnSig || 1;
    const paramRS =
      desiredRecipe?.signalData?.signalData?.table1?.parametRowSig || 1;
    const dataS = generateRandomDataS(paramRS, paramCS);
    // Define the table headers

    function customizeRow(row, data) {
      if (row.index === 0) {
        // First row (index 0) will have gray background color
        row.styles.fillColor = [200, 250, 200]; // RGB color for gray
      }
    }
    doc.autoTable({
      body: dataS,
      didDrawRow: customizeRow,
      startY: startY + 10,
    });
    const NewstartY = doc.autoTable.previous.finalY;
    ///Alarm&Props
    doc.text("Alarme und Meldungen", 10, NewstartY + 10);
    const paramCA =
      desiredRecipe?.alarmPropsData?.alarmpropsData?.table1
        ?.parametColumnAlarm || 1;
    const paramRA =
      desiredRecipe?.alarmPropsData?.alarmpropsData?.table1?.parametRowAlarm ||
      1;
    const dataA = generateRandomDataA(paramRA, paramCA);
    // Define the table headers

    function customizeRow(row, dataA) {
      if (row.index === 0) {
        // First row (index 0) will have gray background color
        row.styles.fillColor = [200, 250, 200]; // RGB color for gray
      }
    }
    doc.autoTable({
      body: dataA,
      didDrawRow: customizeRow,
      startY: NewstartY + 20,
    });
    /////

    const pdfDataUri = doc.output("datauristring");
    // Create a temporary anchor element to trigger the download

    setPdfData(pdfDataUri);
    doc.save("generated-pdf.pdf");
  };
  ////TRYYY
  // const captureComponent = async (componentRef) => {
  //   const canvas = await html2canvas(componentRef);
  //   return canvas.toDataURL('image/png');
  // };

  // const forsubmit = async () => {
  //   const pdf = new jsPDF();

  //   const component1Image = await captureComponent(Parameter);
  //   pdf.addImage(component1Image, 'PNG', 10, 10, 180, 120);
  //   pdf.addPage();

  //   pdf.save('components.pdf');
  // };

  return (
    <div>
      <div></div>
      <h1>PDF Preview</h1>
      <button onClick={handleGeneratePDF}>Preview & Delete the pdf</button>
      {/* <button onClick={forsubmit}>Download the pdf</button> */}

      {pdfData && (
        <div>
          <Document
            file={pdfData}
            onLoadError={(error) => console.log("Error", error)}
          >
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default PDFPreview;
