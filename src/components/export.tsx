import React from "react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Article } from "@/api/news";

interface ExportProps {
  articles: Article[];
}

const Export: React.FC<ExportProps> = ({ articles }) => {
  // Export articles to a PDF file with text wrapping
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Articles Export", 10, 10);
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const lineHeight = 10;
    let y = 20; // Initial vertical position

    articles.forEach((article, index) => {
      const text = `${index + 1}. Title: ${article.title}\nAuthor: ${
        article.author || "Unknown"
      }\nPublished: ${new Date(article.publishedAt).toLocaleDateString()}`;
      const wrappedText = doc.splitTextToSize(text, pageWidth - 2 * margin);

      // Check if the text will fit on the current page; add a new page if not
      if (y + wrappedText.length * lineHeight > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin; // Reset y position for new page
      }

      doc.text(wrappedText, margin, y);
      y += wrappedText.length * lineHeight + lineHeight; // Move to the next block
    });

    doc.save("articles.pdf");
  };

  // Export articles to a CSV file
  const exportToCSV = () => {
    const header = ["Title", "Author", "Type", "Published At"];
    const rows = articles.map((article) => [
      article.title,
      article.author || "Unknown",
      article.type,
      new Date(article.publishedAt).toLocaleDateString(),
    ]);

    const csvContent =
      [header, ...rows]
        .map((row) => row.map((item) => `"${item}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "articles.csv");
  };

  return (
    <div className="p-4 flex gap-4">
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Export as PDF
      </button>
      <button
        onClick={exportToCSV}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Export as CSV
      </button>
    </div>
  );
};

export default Export;
