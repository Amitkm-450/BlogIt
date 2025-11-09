import { POST_VALIDATION_SCHEMA, getPostInitialData } from "constants/form";

import React, { useEffect, useRef, useState } from "react";

import { ExternalLink, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Button,
  Spinner,
  Typography,
  ActionDropdown,
  Dropdown,
} from "@bigbinary/neetoui";
import { Form, Input, Select, Textarea } from "@bigbinary/neetoui/formik";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import {
  useFetchPost,
  useUpdatePost,
  useDeletePost,
} from "hooks/reactQuery/usePostsApi";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { getFromLocalStorage } from "utils/storage";

import { DeleteConfirmationModal, PageLayout } from "../../commons";

const Edit = () => {
  const [isSingleDeleteModalOpen, setIsSingleDeleteModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  const formikRef = useRef(null);

  const history = useHistory();
  const { slug } = useParams();

  const { t } = useTranslation();

  const { data: { post } = {}, isLoading: isPostLoading } = useFetchPost(slug);

  const { data: { categories = [] } = {}, isLoading: isCategoryLoading } =
    useFetchCategories();

  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  const handleCancel = () => {
    formikRef?.current.resetForm();
    setStatus(post.status);
  };

  const handleChangeStatus = () => {
    const values = formikRef.current?.values;
    updatePost(
      {
        slug,
        payload: {
          ...values,
          category_ids: values.categories.map(category => category.id),
          status,
        },
      },
      {
        onSuccess: () => {
          history.replace("/");
        },
      }
    );
  };

  const handleDelete = () => {
    history.replace("/posts");
    deletePost(slug);
  };

  const handleRedirect = () => {
    const values = formikRef.current?.values;

    localStorage.setItem(
      `preview_post_${slug}`,
      JSON.stringify({
        ...values,
        status,
        user: { name: getFromLocalStorage("authUserName") },
      })
    );

    window.open(`/posts/${slug}/preview`, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    setStatus(post?.status);
  }, [post]);

  if (isCategoryLoading || isPostLoading) {
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
            <Button
              icon={ExternalLink}
              style="link"
              tooltipProps={{
                content: "Preview",
                position: "top",
              }}
              onClick={handleRedirect}
            />
            <Button
              label={t("button.cancel")}
              style="secondary"
              onClick={handleCancel}
            />
            <ActionDropdown
              buttonStyle="secondary"
              label={
                status === "draft"
                  ? t("posts.actions.setAsDraft")
                  : t("posts.actions.publish")
              }
              onClick={() => formikRef?.current.submitForm()}
            >
              <Menu>
                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      setStatus("published");
                    }}
                  >
                    {t("posts.actions.publish")}
                  </MenuItemButton>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      setStatus("draft");
                    }}
                  >
                    {t("posts.actions.setAsDraft")}
                  </MenuItemButton>
                </MenuItem>
              </Menu>
            </ActionDropdown>
            <Dropdown buttonStyle="secondary" icon={MenuHorizontal}>
              <Dropdown.MenuItem>
                <Dropdown.MenuItem.Button
                  className="text-red-600"
                  onClick={() => setIsSingleDeleteModalOpen(true)}
                >
                  {t("posts.actions.delete")}
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
              initialValues: getPostInitialData(post),
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
      <DeleteConfirmationModal
        headerMessage={t("posts.deleteAlert.header")}
        isOpen={isSingleDeleteModalOpen}
        setIsOpen={setIsSingleDeleteModalOpen}
        subHeaderMessageKey="posts.deleteAlert.subHeader"
        onSubmit={handleDelete}
      />
    </PageLayout>
  );
};

export default Edit;
