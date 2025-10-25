import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePlayerPDF = async (player, metrics) => {
  // Create a temporary element for PDF generation
  const reportElement = document.getElementById("player-report");

  if (!reportElement) {
    console.error("Report element not found");
    return;
  }

  try {
    // Show loading state
    const originalDisplay = reportElement.style.display;
    reportElement.style.display = "block";

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
    });

    // Restore original display
    reportElement.style.display = originalDisplay;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${player.full_name.replace(/\s+/g, "_")}_GR4DE_Report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback: Create a simple text PDF
    const pdf = new jsPDF();
    pdf.text(`GR4DE Player Report - ${player.full_name}`, 20, 20);
    pdf.text(`Talent Index Score: ${metrics.talent_index_score}`, 20, 40);
    pdf.text(`Position: ${player.position}`, 20, 50);
    pdf.text(`Club: ${player.current_club_name}`, 20, 60);
    pdf.save(
      `${player.full_name.replace(/\s+/g, "_")}_GR4DE_Report_Simple.pdf`
    );
  }
};
