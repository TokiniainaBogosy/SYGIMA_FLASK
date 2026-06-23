import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DashboardReport from "../pdf/DashboardReport";

const reportRef = useRef(null);

const handleExportPdf = async () => {
  if (!reportRef.current) return;

  const canvas = await html2canvas(reportRef.current, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true, // important pour le logo si URL externe
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Dimensions image dans le PDF
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Si le contenu dépasse une page A4, on gère le multi-page
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`dashboard_${user?.prenom || "user"}_${new Date().toISOString().slice(0,10)}.pdf`);
};
export default handleExportPdf