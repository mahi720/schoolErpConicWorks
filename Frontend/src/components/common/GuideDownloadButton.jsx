import React from "react";
import { Download } from "lucide-react";

const GuideDownloadButton = ({ file, label = "Download Guide" }) => {
  const handleDownload = () => {
    const link = document.createElement("a");

    link.href = file;

    link.download = file.split("/").pop() || "guide.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
      title={label}
    >
      <Download size={17} />

      {label}
    </button>
  );
};

export default GuideDownloadButton;
