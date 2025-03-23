import React, { useEffect, useState } from "react";

import { Button, Modal } from "@bigbinary/neetoui";
import FileSaver from "file-saver";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import postsApi from "../../apis/posts";
import createConsumer from "../../channels/consumer";
import { subscribeToReportDownloadChannel } from "../../channels/reportDownloadChannel";
import { ProgressBar } from "../commons";

const DownloadReportModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const { slug } = useParams();
  const consumer = createConsumer();

  const generatePdf = async () => {
    try {
      await postsApi.generatePdf(slug);
    } catch (error) {
      logger.error("Error while generating PDF:", error);
    }
  };

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const { data } = await postsApi.download(slug);
      FileSaver.saveAs(data, `${slug}.pdf`);
    } catch (error) {
      logger.error("Error while downloading PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      setMessage("Report is ready to be downloaded");
    }
  }, [progress]);

  return (
    <Modal isOpen={isOpen} size="medium" onClose={onClose}>
      <Modal.Header>Download Post Details</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-xl font-semibold">{message}</p>
          <ProgressBar progress={progress} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          buttonText="Download"
          disabled={isLoading}
          label="Download"
          style="primary"
          onClick={downloadPdf}
        />
        <Button buttonText="Close" style="secondary" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};

export default DownloadReportModal;
