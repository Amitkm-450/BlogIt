import React, { useEffect, useState } from "react";

import { Modal, Toastr } from "@bigbinary/neetoui";
import postsApi from "apis/posts";

const DownloadModal = ({ isOpen, onClose, slug }) => {
  const [isLoading, setIsLoading] = useState(true);

  const generatePdf = async () => {
    try {
      await postsApi.generatePdf(slug);
    } catch (error) {
      logger.error(error);
    }
  };

  const saveAs = ({ blob, fileName }) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 150);
  };

  const downloadPdf = async () => {
    try {
      Toastr.success("Downloading report...");
      const { data } = await postsApi.download(slug);
      saveAs({ blob: data, fileName: `${slug}.pdf` });
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generatePdf();
    setTimeout(() => {
      downloadPdf();
    }, 5000);
  }, []);

  const message = isLoading
    ? "Report is being generated..."
    : "Report downloaded!";

  return (
    <Modal isOpen={isOpen} size="medium" onClose={onClose}>
      <div className="flex h-10 items-center justify-center">{message}</div>
    </Modal>
  );
};

export default DownloadModal;
