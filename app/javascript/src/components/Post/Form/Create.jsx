import { getPostInitialData } from "constants/form";
import { POST_STATUS } from "constants/post";

import React, { useRef, useState } from "react";

import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useCreatePost } from "hooks/reactQuery/usePostsApi";
import { ActionDropdown, Button, Spinner, Typography } from "neetoui";
import { pluck } from "ramda";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";

import Form from "./Form";

import { PageLayout } from "../../commons";

const {
  Menu: ActionMenu,
  MenuItem: ActionMenuItem,
  Divider: ActionDivider,
} = ActionDropdown;
const { Button: ActionMenuItemButton } = ActionMenuItem;

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
        category_ids: pluck("id", values.categories),
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
              buttonStyle="primary"
              buttonProps={{
                className: "bg-black text-white",
              }}
              dropdownProps={{
                buttonProps: {
                  className: "bg-black text-white",
                },
              }}
              label={
                status === POST_STATUS.DRAFT
                  ? t("posts.actions.setAsDraft")
                  : t("posts.actions.publish")
              }
              onClick={() => formikRef?.current.submitForm()}
            >
              <ActionMenu>
                <ActionMenuItem>
                  <ActionMenuItemButton
                    onClick={() => {
                      setStatus(POST_STATUS.PUBLISHED);
                    }}
                  >
                    {t("posts.actions.publish")}
                  </ActionMenuItemButton>
                </ActionMenuItem>
                <ActionDivider />
                <ActionMenuItem>
                  <ActionMenuItemButton
                    onClick={() => {
                      setStatus(POST_STATUS.DRAFT);
                    }}
                  >
                    {t("posts.actions.setAsDraft")}
                  </ActionMenuItemButton>
                </ActionMenuItem>
              </ActionMenu>
            </ActionDropdown>
          </div>
        </div>
        <div className="mx-auto w-full rounded-lg bg-white p-6 shadow">
          <Form
            {...{ categories, formikRef }}
            initialValues={getPostInitialData()}
            onSubmit={handleChangeStatus}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Create;
