import React from "react";

import { Alert, Typography } from "neetoui";
import { Trans } from "react-i18next";

const DeleteConfirmationModal = ({
  isOpen,
  setIsOpen,
  onSubmit,
  headerMessage,
  values = {},
  subHeaderMessageKey,
}) => {
  const handleSubmit = () => {
    setIsOpen(false);
    onSubmit();
  };

  return (
    <Alert
      isOpen={isOpen}
      title={headerMessage}
      message={
        <Trans
          i18nKey={subHeaderMessageKey}
          values={values}
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
