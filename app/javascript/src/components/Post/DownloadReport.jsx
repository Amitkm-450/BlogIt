import React, { useEffect, useState } from "react";

import { Button } from "@bigbinary/neetoui";
import FileSaver from "file-saver";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import postsApi from "../../apis/posts";
import createConsumer from "../../channels/consumer";
import { subscribeToReportDownloadChannel } from "../../channels/reportDownloadChannel";
import { ProgressBar } from "../commons";
import PageLayout from "../commons/PageLayout";

const DownloadReport = () => {
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

      FileSaver.saveAs(data, "granite_task_report.pdf");
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
    <PageLayout>
      <div className="flex flex-col gap-y-8">
        <h3>Download post details:</h3>
        <div className="mb-4 flex w-full flex-col">
          <div className="mx-auto mb-4 w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-2xl">
            <div className="space-y-2 p-6">
              <p className="text-xl font-semibold">{message}</p>
              <ProgressBar progress={progress} />
            </div>
          </div>
          <Button
            buttonText="Download"
            disabled={isLoading}
            label="Download"
            style="link"
            onClick={downloadPdf}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default DownloadReport;
