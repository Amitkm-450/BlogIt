import React from "react";

import { Alert, Typography } from "@bigbinary/neetoui";
import { Trans, useTranslation } from "react-i18next";

const DeleteConfirmationModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    setIsOpen(false);
    onSubmit();
  };

  return (
    <Alert
      isOpen={isOpen}
      title={t("posts.deleteAlert.header")}
      message={
        <Trans
          i18nKey="posts.deleteAlert.subHeader"
          components={{
            typography: (
              <Typography
                className="text-gray-600"
                component="span"
                style="body2"
                weight="semibold"
              />
            ),
          }}
        />
      }
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
    />
  );
};

export default DeleteConfirmationModal;
