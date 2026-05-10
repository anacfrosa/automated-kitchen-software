import * as XLSX from "xlsx"; // Import xlsx library
import { saveAs } from "file-saver"; // Import saveAs from file-saver library

// Function to export data to Excel
export function exportToExcel(fileName: string, data: any) {
  const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to worksheet
  const wb = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Add the worksheet to the workbook
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" }); // Convert workbook to array buffer
  saveAsExcelFile(excelBuffer, fileName + ".xlsx"); // Save the Excel file
}

export function exportToCSV(fileName: string, data: any[]) {
  const csvContent = convertToCSV(data); // Convert data to CSV format
  saveAsCSVFile(csvContent, fileName + ".csv"); // Save the CSV file
}

// Function to convert data to CSV format
function convertToCSV(data: any[]): string {
  const csvRows = [];
  // Get the headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Loop through data and push rows to CSV
  data.forEach((item) => {
    const values = headers.map((header) => {
      const escaped = ("" + item[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
}

// Function to save CSV file
function saveAsCSVFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  saveAs(blob, fileName);
}

// Function to save Excel file
const saveAsExcelFile = (buffer: any, fileName: string) => {
  const data = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(data, fileName);
};
