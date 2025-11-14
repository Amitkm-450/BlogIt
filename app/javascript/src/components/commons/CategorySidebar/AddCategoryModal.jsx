import {
  CATEGORY_INITIAL_VALUES,
  CATEGORY_VALIDATION_SCHEMA,
} from "constants/form";

import React, { useRef, useState } from "react";

import { useCreateCategory } from "hooks/reactQuery/useCategoriesApi";
import { Button, Modal, Typography } from "neetoui";
import { Form, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";

const { Header, Body, Footer } = Modal;

const AddCategoryModel = ({ isModalOpen, onClose }) => {
  const [isSubmittable, setIsSubmittable] = useState(false);
  const { t } = useTranslation();

  const formRef = useRef(null);

  const { mutate: createCategory } = useCreateCategory();

  const handleSubmit = values => {
    createCategory(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      closeOnOutsideClick
      isOpen={isModalOpen}
      size="medium"
      onClose={onClose}
    >
      <Header>
        <Typography style="h2">{t("categorySidebar.modal.header")}</Typography>
      </Header>
      <Body>
        <div className="space-y-4">
          <Form
            formikProps={{
              initialValues: CATEGORY_INITIAL_VALUES,
              validationSchema: CATEGORY_VALIDATION_SCHEMA,
              onSubmit: handleSubmit,
              innerRef: formRef,
            }}
          >
            {({ dirty }) => {
              setIsSubmittable(dirty);

              return (
                <Input
                  label={t("categorySidebar.modal.input.label")}
                  name="name"
                  placeholder={t("categorySidebar.modal.input.placeholder")}
                />
              );
            }}
          </Form>
        </div>
      </Body>
      <Footer className="flex space-x-4">
        <Button
          className="bg-black text-white"
          disabled={!isSubmittable}
          label={t("categorySidebar.modal.button.addCategory")}
          onClick={() => formRef?.current.submitForm()}
        />
        <Button
          label={t("categorySidebar.modal.button.cancel")}
          style="secondary"
          onClick={() => formRef?.current.resetForm()}
        />
      </Footer>
    </Modal>
  );
};

export default AddCategoryModel;
