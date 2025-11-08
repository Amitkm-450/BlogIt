import { PostValidationSchema } from "constants/constant";

import React, { useEffect, useRef, useState } from "react";

import { MenuHorizontal, Redirection } from "@bigbinary/neeto-icons";
import {
  Button,
  Spinner,
  Typography,
  ActionDropdown,
  Dropdown,
} from "@bigbinary/neetoui";
import { Form, Input, Select, Textarea } from "@bigbinary/neetoui/formik";
import postsApi from "apis/posts";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { getFromLocalStorage } from "utils/storage";

import { PageLayout } from "../../commons";

const Edit = () => {
  const [postLoading, setPostLoading] = useState(false);
  const [postInitialData, setPostInitialData] = useState(null);
  const [status, setStatus] = useState("");

  const formikRef = useRef(null);

  const history = useHistory();
  const { slug } = useParams();

  const { t } = useTranslation();

  const { data: { categories = [] } = {}, isLoading: isCategoryLoading } =
    useFetchCategories();

  const handleChangeStatus = async () => {
    try {
      const values = formikRef.current?.values;
      await postsApi.update({
        slug,
        payload: {
          ...values,
          category_ids: values.categories.map(category => category.id),
          status,
        },
      });
      history.replace("/");
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await postsApi.destroy(slug);
      history.replace("/posts");
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleRedirect = () => {
    const values = formikRef.current?.values;
    history.push({
      pathname: `/posts/${slug}/preview`,
      state: {
        post: {
          ...values,
          status,
          user: {
            name: getFromLocalStorage("authUserName"),
          },
        },
      },
    });
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      setPostLoading(true);
      try {
        const { post } = await postsApi.show(slug);
        setPostInitialData({
          title: post.title || "",
          description: post.description || "",
          categories:
            post.categories?.map(category => ({
              name: category.name,
              id: category.id,
            })) || [],
        });
        setStatus(post.status);
      } catch (error) {
        Logger.log(error);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPostDetails();
  }, []);

  if (isCategoryLoading || postLoading) {
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
            {t("header.editBlogPost")}
          </Typography>
          <div className="flex items-center space-x-2">
            <Button icon={Redirection} style="link" onClick={handleRedirect} />
            <Button
              label={t("button.cancel")}
              style="secondary"
              onClick={() => formikRef?.current.resetForm()}
            />
            <ActionDropdown
              buttonStyle="secondary"
              label={status === "draft" ? "Save as draft" : "Publish"}
              onClick={() => formikRef?.current.submitForm()}
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
            <Dropdown buttonStyle="secondary" icon={MenuHorizontal}>
              <Dropdown.MenuItem>
                <Dropdown.MenuItem.Button
                  className="text-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </Dropdown.MenuItem.Button>
              </Dropdown.MenuItem>
            </Dropdown>
          </div>
        </div>
        <div className="w-full rounded-lg bg-white p-6 shadow">
          <Form
            formikProps={{
              validateOnBlur: true,
              enableReinitialize: true,
              initialValues: postInitialData,
              validationSchema: PostValidationSchema,
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

export default Edit;
