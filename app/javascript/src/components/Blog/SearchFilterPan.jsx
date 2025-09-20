import {
  FilterInitialValues,
  FilterValidationSchema,
} from "constants/constant";

import React, { useEffect, useState } from "react";

import { Pane, Spinner, Typography } from "@bigbinary/neetoui";
import { Button, Form, Input, Select } from "@bigbinary/neetoui/formik";
import categoriesApi from "apis/categories";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";

const SearchFilterPan = ({ isOpen, onClose, handleFilterApplied }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categories = await categoriesApi.fetch();

        setCategories(
          categories.map(category => ({
            label: category.name,
            value: category.id,
          }))
        );
      } catch (error) {
        Logger.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleApplyFilters = values => {
    const filters = {
      title: values.title.length > 0 ? values.title : undefined,
      categories: values.categories.length > 0 ? values.categories : undefined,
      status: values.status?.value,
    };
    handleFilterApplied(filters);
    onClose();
  };

  if (isLoading) {
    <div className="h-full">
      <Spinner />
    </div>;
  }

  return (
    <Pane className="h-full" isOpen={isOpen} onClose={onClose}>
      <Form
        formikProps={{
          validateOnBlur: true,
          enableReinitialize: true,
          initialValues: FilterInitialValues,
          validationSchema: FilterValidationSchema,
          onSubmit: handleApplyFilters,
        }}
      >
        {({ resetForm }) => (
          <div className="flex h-screen flex-col justify-between">
            <div className="flex h-full flex-col gap-y-4 p-6">
              <Typography style="h2">{t("filterForm.header")}</Typography>
              <div>
                <Input
                  className="mb-4"
                  label={t("filterForm.label.title")}
                  name="title"
                  placeholder={t("filterForm.placeholder.title")}
                />
              </div>
              <div>
                <Select
                  isMulti
                  className="mb-4"
                  label={t("filterForm.label.categories")}
                  name="categories"
                  options={categories}
                  placeholder={t("filterForm.placeholder.categories")}
                />
              </div>
              <div>
                <Select
                  className="mb-4"
                  label={t("filterForm.label.status")}
                  name="status"
                  placeholder={t("filterForm.placeholder.status")}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4">
              <Button
                className="bg-black text-white"
                label={t("filterForm.button.done")}
                type="submit"
              />
              <Button
                label={t("filterForm.button.clearFilter")}
                style="secondary"
                onClick={() => resetForm()}
              />
            </div>
          </div>
        )}
      </Form>
    </Pane>
  );
};

export default SearchFilterPan;
