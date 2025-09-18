import React, { useEffect, useRef, useState } from "react";

import {
  ActionDropdown,
  Button,
  Spinner,
  Typography,
} from "@bigbinary/neetoui";
import { Form, Input, Select, Textarea } from "@bigbinary/neetoui/formik";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import {
  PostInitialData,
  PostValidationSchema,
} from "../../constants/constant";
import { PageLayout } from "../commons";

const Create = () => {
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("draft");

  const history = useHistory();
  const { t } = useTranslation();

  const formikRef = useRef(null);

  const handleCancel = () => history.push("/");

  const handleChangeStatus = async () => {
    try {
      const values = formikRef.current?.values;
      await postsApi.create({
        post: {
          ...values,
          category_ids: values.categories.map(category => category.value),
          organization_id: 1,
          status,
        },
      });
      history.replace("/");
    } catch (error) {
      Logger.error(error);
    }
  };

  const categoriesOption = categories?.map(category => ({
    value: category.id,
    label: category.name,
  }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await categoriesApi.fetch();
        setCategories(categories);
      } catch (error) {
        Logger.log(error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (categoryLoading) {
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
              onClick={handleCancel}
            />
            <ActionDropdown
              buttonStyle="secondary"
              label={status === "draft" ? "Save as draft" : "Publish"}
              onClick={handleChangeStatus}
            >
              <Menu>
                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      setStatus("published");
                    }}
                  >
                    Publish
                  </MenuItemButton>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      setStatus("draft");
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
              initialValues: PostInitialData,
              validationSchema: PostValidationSchema,
              innerRef: formikRef,
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
                  options={categoriesOption}
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
