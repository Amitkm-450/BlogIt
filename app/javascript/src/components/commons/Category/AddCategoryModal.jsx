import React, { useState } from "react";

import { Button, Modal, Input, Typography } from "@bigbinary/neetoui";
import { useTranslation } from "react-i18next";

import categoriesApi from "../../../apis/categories";

const AddCategoryModel = ({ isModalOpen, onClose }) => {
  const [categoryName, setCategoryName] = useState("");

  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      await categoriesApi.create({
        category: { name: categoryName },
      });

      setCategoryName("");
      onClose();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

  const { Header, Body, Footer } = Modal;

  return (
    <Modal
      closeOnOutsideClick
      isOpen={isModalOpen}
      size="medium"
      onClose={onClose}
    >
      <Header>
        <Typography component="h3" style="h2">
          {t("categorySidebar.modal.header")}
        </Typography>
      </Header>
      <Body>
        <div className="space-y-4">
          <Input
            label={t("categorySidebar.modal.input.label")}
            placeholder={t("categorySidebar.modal.input.placeholder")}
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
        </div>
      </Body>
      <Footer className="flex space-x-4">
        <Button
          className="bg-black text-white"
          label={t("categorySidebar.modal.button.addCategory")}
          onClick={handleSubmit}
        />
        <Button
          label={t("categorySidebar.modal.button.cancel")}
          style="secondary"
          onClick={onClose}
        />
      </Footer>
    </Modal>
  );
};

export default AddCategoryModel;
