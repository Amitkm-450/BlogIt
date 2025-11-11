import {
  getFilterInitialValues,
  FILTER_VALIDATION_SCHEMA,
} from "constants/form";
import { POST_STATUS } from "constants/post";

import React, { useRef } from "react";

import { Pane, Spinner, Typography, Button } from "@bigbinary/neetoui";
import { Form, Input, Select } from "@bigbinary/neetoui/formik";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";

const SearchFilterPan = ({ isOpen, onClose, handleFilterApplied }) => {
  const { data: { categories = [] } = {}, isLoading } = useFetchCategories();

  const { t } = useTranslation();

  const history = useHistory();

  const filterFormRef = useRef(null);

  const {
    searchTerm = "",
    status = "",
    categories: queryCategories = "",
  } = useQueryParams();

  const selectedCategories =
    queryCategories
      .split(",")
      .map(name => categories.find(cat => cat.name === name))
      .filter(Boolean) || [];

  const handleApplyFilters = () => {
    const values = filterFormRef?.current.values;
    const filters = {
      title: values.title.length > 0 ? values.title : undefined,
      categories: values.categories.length > 0 ? values.categories : undefined,
      status: values.status?.value,
    };

    handleFilterApplied(filters);
    onClose();
  };

  const handleClearFilter = () => {
    filterFormRef?.current.resetForm({
      values: {
        title: "",
        categories: [],
        status: {},
      },
    });
    history.replace(routes.posts.myBlogs);
  };

  if (isLoading) {
    <div className="h-full">
      <Spinner />
    </div>;
  }

  return (
    <Pane className="h-full" isOpen={isOpen} onClose={onClose}>
      <div className="flex h-screen flex-col justify-between">
        <Form
          formikProps={{
            validateOnBlur: true,
            enableReinitialize: true,
            initialValues: getFilterInitialValues({
              searchTerm,
              selectedCategories,
              status,
            }),
            validationSchema: FILTER_VALIDATION_SCHEMA,
            innerRef: filterFormRef,
          }}
        >
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
                optionRemapping={{ label: "name", value: "id" }}
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
                  { label: "Draft", value: POST_STATUS.DRAFT },
                  { label: "Published", value: POST_STATUS.PUBLISHED },
                ]}
              />
            </div>
          </div>
        </Form>
        <div className="flex gap-3 px-6 py-4">
          <Button
            className="bg-black text-white"
            label={t("filterForm.button.done")}
            onClick={handleApplyFilters}
          />
          <Button
            label={t("filterForm.button.clearFilter")}
            style="secondary"
            onClick={handleClearFilter}
          />
        </div>
      </div>
    </Pane>
  );
};

export default SearchFilterPan;
