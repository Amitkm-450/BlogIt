import { getPostInitialValues } from "constants/form";
import { POST_STATUS } from "constants/post";

import React, { useEffect, useRef, useState } from "react";

import classNames from "classnames";
import dayjs from "dayjs";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import {
  useFetchPost,
  useUpdatePost,
  useDeletePost,
} from "hooks/reactQuery/usePostsApi";
import { ExternalLink, MenuHorizontal } from "neetoicons";
import { Button, Spinner, Typography, ActionDropdown, Dropdown } from "neetoui";
import { pluck } from "ramda";
import { Trans, useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import routes from "routes";
import { getFromLocalStorage } from "utils/storage";
import { buildUrl } from "utils/url";

import Form from "./Form";

import {
  DeleteConfirmationModal,
  PageLayout,
  PageNotFound,
} from "../../commons";

const {
  Menu: ActionMenu,
  MenuItem: ActionMenuItem,
  Divider: ActionDivider,
} = ActionDropdown;
const { Button: ActionMenuItemButton } = ActionMenuItem;

const { MenuItem } = Dropdown;
const { Button: MenuItemButton } = MenuItem;

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
          category_ids: pluck("id", values.categories),
          status,
        },
      },
      {
        onSuccess: () => {
          history.replace(routes.posts.root);
        },
      }
    );
  };

  const handleDelete = () => {
    history.replace(routes.posts.root);
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

    window.open(
      buildUrl(routes.posts.preview, { slug }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const currentUserId = getFromLocalStorage("authUserId");
  const isUnauthorized = currentUserId !== post?.user?.id;

  const isDraft = post?.status === POST_STATUS.DRAFT;

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

  if (isUnauthorized) {
    return <PageNotFound />;
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-start px-4">
        <div className="flex w-full justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.editBlogPost")}
          </Typography>
          <div className="flex items-center space-x-2">
            <Trans
              i18nKey="posts.draftSavedAt"
              components={{
                span: (
                  <Typography
                    style="body2"
                    className={classNames("text-gray-400", {
                      hidden: !isDraft,
                      block: isDraft,
                    })}
                  />
                ),
              }}
              values={{
                time: dayjs(post.updatedAt).format("MMM D, YYYY h:mm A"),
              }}
            />
            <Button
              icon={ExternalLink}
              style="link"
              tooltipProps={{
                content: t("posts.actions.preview"),
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
            <Dropdown buttonStyle="secondary" icon={MenuHorizontal}>
              <MenuItem>
                <MenuItemButton
                  className="text-red-600"
                  onClick={() => setIsSingleDeleteModalOpen(true)}
                >
                  {t("posts.actions.delete")}
                </MenuItemButton>
              </MenuItem>
            </Dropdown>
          </div>
        </div>
        <div className="w-full rounded-lg bg-white p-6 shadow">
          <Form
            {...{ categories, formikRef }}
            initialValues={getPostInitialValues(post)}
            onSubmit={handleChangeStatus}
          />
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
