import React from "react";

import { Button, Modal, Typography } from "@bigbinary/neetoui";
import { useTranslation } from "react-i18next";

const DeleteConfirmationModal = ({ isOpen, onClose, handleBulkDelete }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} size="medium" onClose={onClose}>
      <div className="flex flex-col space-y-4 p-2">
        <Typography style="body2" weight="bold">
          {t("subHeader.deleteModal.header")}
        </Typography>
        <div className="flex w-full space-x-2">
          <Button
            label={t("button.cancel")}
            style="secondary"
            onClick={onClose}
          />
          <Button
            label={t("button.delete")}
            style="danger"
            onClick={handleBulkDelete}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
