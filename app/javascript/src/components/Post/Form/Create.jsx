import { POST_VALIDATION_SCHEMA, getPostInitialData } from "constants/form";
import { POST_STATUS } from "constants/post";

import React, { useRef, useState } from "react";

import {
  ActionDropdown,
  Button,
  Spinner,
  Typography,
} from "@bigbinary/neetoui";
import { Form, Input, Select, Textarea } from "@bigbinary/neetoui/formik";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useCreatePost } from "hooks/reactQuery/usePostsApi";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";

import { PageLayout } from "../../commons";

const Create = () => {
  const [status, setStatus] = useState(POST_STATUS.DRAFT);

  const history = useHistory();
  const { t } = useTranslation();

  const formikRef = useRef(null);

  const { data: { categories = [] } = {}, isLoading: isCategoryLoading } =
    useFetchCategories();

  const { mutate: createPost } = useCreatePost();

  const handleChangeStatus = () => {
    const values = formikRef.current?.values;
    createPost(
      {
        ...values,
        category_ids: values.categories.map(category => category.id),
        organization_id: 1,
        status,
      },
      {
        onSuccess: () => {
          history.replace(routes.posts.root);
        },
      }
    );
  };

  if (isCategoryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const { Menu, MenuItem, Divider } = ActionDropdown;
  const { Button: MenuItemButton } = MenuItem;

  return (
    <PageLayout>
      <div className="flex flex-col items-start px-4">
        <div className="flex w-full justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.newBlogPost")}
          </Typography>
          <div className="flex items-center space-x-2">
            <Button
              label={t("button.cancel")}
              style="secondary"
              onClick={() => formikRef?.current.resetForm()}
            />
            <ActionDropdown
              buttonStyle="secondary"
              label={status === POST_STATUS.DRAFT ? "Save as draft" : "Publish"}
              onClick={() => formikRef?.current.submitForm()}
            >
              <Menu>
                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      setStatus(POST_STATUS.PUBLISHED);
                    }}
                  >
                    Publish
                  </MenuItemButton>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      setStatus(POST_STATUS.DRAFT);
                    }}
                  >
                    Save as draft
                  </MenuItemButton>
                </MenuItem>
              </Menu>
            </ActionDropdown>
          </div>
        </div>
        <div className="mx-auto w-full rounded-lg bg-white p-6 shadow">
          <Form
            formikProps={{
              validateOnBlur: true,
              enableReinitialize: true,
              initialValues: getPostInitialData(),
              validationSchema: POST_VALIDATION_SCHEMA,
              innerRef: formikRef,
              onSubmit: handleChangeStatus,
            }}
          >
            <div className="mb-4">
              <Input
                label={t("form.label.title")}
                name="title"
                placeholder={t("form.placeholder.title")}
                size="large"
              />
            </div>
            <div className="flex flex-col">
              <div className="mb-1 mt-1 w-full">
                <Select
                  isMulti
                  isSearchable
                  label={t("form.label.categories")}
                  menuPosition="fixed"
                  name="categories"
                  optionRemapping={{ label: "name", value: "id" }}
                  options={categories}
                  placeholder={t("form.placeholder.categories")}
                  size="large"
                />
              </div>
            </div>
            <div className="mb-4">
              <Textarea
                label={t("form.label.description")}
                name="description"
                placeholder={t("form.placeholder.description")}
                size="large"
              />
            </div>
          </Form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Create;
