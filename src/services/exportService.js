import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportService = {
  toCSV: (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  toExcel: (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  },

  toPDF: (data, filename, headers) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(filename, 14, 22);
    
    doc.autoTable({
      head: [headers],
      body: data.map(row => headers.map(header => row[header])),
      startY: 30,
      styles: {
        fontSize: 12,
        cellPadding: 5,
        overflow: 'linebreak',
        halign: 'center'
      },
      headStyles: {
        fillColor: [66, 153, 225],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    });

    doc.save(`${filename}.pdf`);
  }
};
