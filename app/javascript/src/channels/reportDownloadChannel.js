import { getFromLocalStorage } from "utils/storage";

export const subscribeToReportDownloadChannel = ({
  consumer,
  setMessage,
  setProgress,
  generatePdf,
}) => {
  const userId = getFromLocalStorage("authUserId");
  logger.log("Inside the subscribeToReportDownloadChannel");
  const reportDownloadSubscription = consumer.subscriptions.create(
    {
      channel: "ReportDownloadChannel",
      pubsub_token: userId,
    },
    {
      connected() {
        logger.log("Connected to ReportDownloadChannel");
        setMessage("Connected the Cables...");
        generatePdf();
      },
      received(data) {
        logger.log("Received data from WebSocket:", data);
        const { message, progress } = data;
        setMessage(message);
        setProgress(progress);
      },
    }
  );

  return reportDownloadSubscription;
};
