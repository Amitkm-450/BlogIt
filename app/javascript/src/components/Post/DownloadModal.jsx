import React, { useEffect, useState } from "react";

import { Button, Modal } from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import createConsumer from "channels/consumer";
import FileSaver from "file-saver";

import { subscribeToReportDownloadChannel } from "../../channels/postPdfDownloadChannel";
import { ProgressBar } from "../commons";

const DownloadModal = ({ isOpen, onClose, slug }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const consumer = createConsumer();

  const generatePdf = async () => {
    try {
      await postsApi.generatePdf(slug);
    } catch (error) {
      logger.error(error);
    }
  };

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const { data } = await postsApi.download(slug);
      FileSaver.saveAs(data, `${slug}_report.pdf`);
    } catch (error) {
      logger.error(error);
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
      <div className="mb-4 w-full">
        <div className="mx-auto mb-4 w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-2xl">
          <div className="space-y-2 p-6">
            <p className="text-xl font-semibold">{message}</p>
            <ProgressBar progress={progress} />
          </div>
        </div>
        <Button label="Download" loading={isLoading} onClick={downloadPdf} />
      </div>
    </Modal>
  );
};

export default DownloadModal;
