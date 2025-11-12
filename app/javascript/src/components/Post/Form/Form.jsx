import { POST_VALIDATION_SCHEMA } from "constants/form";

import React from "react";

import {
  Form as NeetoForm,
  Input,
  Select,
  Textarea,
} from "@bigbinary/neetoui/formik";
import withT from "utils/withT";

const Form = ({ formikRef, categories, initialValues, onSubmit, t }) => (
  <div className="w-full rounded-lg bg-white p-6 shadow">
    <NeetoForm
      formikProps={{
        validateOnBlur: true,
        enableReinitialize: true,
        initialValues,
        validationSchema: POST_VALIDATION_SCHEMA,
        innerRef: formikRef,
        onSubmit,
      }}
    >
      <div className="mb-4">
        <Input
          label={t("posts.form.title")}
          name="title"
          placeholder={t("posts.form.title")}
          size="large"
        />
      </div>
      <div className="flex flex-col">
        <div className="mb-1 mt-1 w-full">
          <Select
            isMulti
            isSearchable
            label={t("posts.form.categories")}
            menuPosition="fixed"
            name="categories"
            optionRemapping={{ label: "name", value: "id" }}
            options={categories}
            placeholder={t("posts.form.categories")}
            size="large"
          />
        </div>
      </div>
      <div className="mb-4">
        <Textarea
          label={t("posts.form.description")}
          name="description"
          placeholder={t("posts.form.description")}
          size="large"
        />
      </div>
    </NeetoForm>
  </div>
);

export default withT(Form);
