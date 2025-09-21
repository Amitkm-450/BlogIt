import React from "react";

import { Modal } from "@bigbinary/neetoui";

const DownloadModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} size="medium" onClose={onClose}>
    Download
  </Modal>
);

export default DownloadModal;
