import React, { useState } from "react";

import { capitalize } from "@bigbinary/neeto-cist";
import { MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Dropdown,
  Spinner,
  Table,
  Tooltip,
  Typography,
  NoData,
  Tag,
  Button,
} from "@bigbinary/neetoui";
import classNames from "classnames";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import {
  useFetchPosts,
  useUpdatePost,
  useDeletePost,
  useBulkDestroyPosts,
  useBulkStatusUpdate,
} from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { formatDate } from "utils/date";
import { buildFilterParams, buildUrl, handleFilterRemove } from "utils/url";

import SearchFilterPan from "./SearchFilterPan";
import SubHeader from "./SubHeader";

import { DeleteConfirmationModal, PageLayout } from "../commons";

const Blogs = () => {
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isSingleDeleteModalOpen, setIsSingleDeleteModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedPostSlug, setSelectedPostSlug] = useState("");
  const [isSearchPanOpen, setIsSearchPanOpen] = useState(false);

  const history = useHistory();

  const { t } = useTranslation();

  const columnData = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      width: 100,
      render: (title, post) => {
        if (title.length > 30) {
          return (
            <Tooltip content={title} position="right">
              <a
                className="block max-w-xs truncate"
                href={`/posts/${post.slug}/edit`}
              >
                {`${title.slice(0, 30)}...`}
              </a>
            </Tooltip>
          );
        }

        return (
          <a
            className="block max-w-xs truncate"
            href={`/posts/${post.slug}/edit`}
          >
            {title}
          </a>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
      width: 200,
      render: categories =>
        categories?.length > 0
          ? categories.map(({ name }) => name).join(", ")
          : "—",
    },
    {
      dataIndex: "updatedAt",
      key: "updated_at",
      title: "Last Published At",
      width: 200,
      render: updatedAt => (
        <div className="flex items-center">
          {updatedAt ? formatDate(updatedAt) : "—"}
        </div>
      ),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 100,
      render: status => capitalize(status),
    },
    {
      title: "Actions",
      width: 50,
      render: (_, post) => (
        <Dropdown
          buttonStyle="text"
          icon={MenuHorizontal}
          position="bottom-end"
          strategy="fixed"
        >
          <Menu>
            <MenuItem>
              <MenuItemButton
                className="text-black"
                style="link"
                onClick={() =>
                  post.status === "published"
                    ? handleChange(post.slug, "draft")
                    : handleChange(post.slug, "published")
                }
              >
                {post.status === "published"
                  ? t("posts.actions.unpublish")
                  : t("posts.actions.publish")}
              </MenuItemButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemButton
                style="danger"
                type="delete"
                onClick={() => handleDelete(post.slug)}
              >
                {t("posts.actions.delete")}
              </MenuItemButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
    },
  ];

  const [checkedColumns, setCheckedColumns] = useState(() =>
    columnData.reduce((acc, { title }) => {
      acc[title] = true;

      return acc;
    }, {})
  );

  const queryParams = useQueryParams();
  const {
    searchTerm = "",
    status = "",
    categories: queryCategories = "",
  } = queryParams;

  const shouldShowFilters =
    isEmpty(selectedRowIds) &&
    Object.keys(queryParams)
      .filter(key => key !== "page")
      .some(key => Boolean(queryParams[key]));

  const { data: { categories = [] } = {} } = useFetchCategories();

  const selectedCategoryIds = categories
    .filter(({ name }) => queryCategories?.split(",").includes(name))
    .map(({ id }) => id);

  const filterParams = {
    ...(searchTerm && { title: searchTerm }),
    ...(selectedCategoryIds.length > 0 && {
      category_ids: selectedCategoryIds,
    }),
    ...(status && { status }),
  };

  const filters = {
    ...(searchTerm && { searchTerm }),
    ...(status && { status }),
    ...(queryCategories && { categories: queryCategories }),
  };

  const { data: userBlogs = [], isLoading: isPostsLoading } = useFetchPosts({
    params: filterParams,
    scope: "user",
  });

  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: bulkDestroyPosts } = useBulkDestroyPosts();
  const { mutate: bulkStatusUpdate } = useBulkStatusUpdate();

  const handleChange = (slug, status) => {
    updatePost({
      slug,
      payload: {
        status,
      },
      quiet: true,
    });
  };

  const handleCheck = title => {
    setCheckedColumns(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleDelete = slug => {
    setIsSingleDeleteModalOpen(true);
    setSelectedPostSlug(slug);
  };

  const handleBulkDelete = () => {
    bulkDestroyPosts(selectedRowIds, {
      onSuccess: () => {
        setSelectedRowKeys([]);
        setSelectedRowIds([]);
      },
    });
  };

  const handleBulkUpdate = status => {
    bulkStatusUpdate(
      { postIds: selectedRowIds, status },
      {
        onSuccess: () => {
          setSelectedRowKeys([]);
          setSelectedRowIds([]);
        },
      }
    );
  };

  const handleFilterApplied = values => {
    const searchParams = buildFilterParams(values);

    const url = buildUrl("/posts/my-blogs", searchParams);
    history.replace(url);
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowIds(selectedRows.map(selectedRow => selectedRow.id));
  };

  const handleSingleDelete = () => {
    deletePost(selectedPostSlug, {
      onSuccess: () => {
        setSelectedRowKeys([]);
        setSelectedRowIds([]);
      },
    });
  };

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  const filteredColumnData = columnData.filter(
    column => checkedColumns[column.title]
  );

  const selectedPostsCount = selectedRowKeys.length;

  if (isPostsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-start px-4">
        <div className="flex w-full justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.myBlogPosts")}
          </Typography>
        </div>
        <SubHeader
          {...{
            setIsSearchPanOpen,
            selectedRowKeys,
            userBlogs,
            handleCheck,
            checkedColumns,
            handleBulkUpdate,
            columnData,
          }}
          setIsDeleteModalOpen={setIsBulkDeleteModalOpen}
        />
      </div>
      <div
        className={classNames("flex items-center space-x-8", {
          hidden: !shouldShowFilters,
          block: shouldShowFilters,
        })}
      >
        <div className="flex items-center space-x-3 py-2">
          {!isEmpty(filters) &&
            Object.entries(filters)
              .filter(([_, value]) => Boolean(value))
              .map(([key, value]) => {
                if (key === "status") value = capitalize(value);

                return (
                  <Tag
                    key={key}
                    style="secondary"
                    label={
                      <Trans
                        i18nKey={`posts.filters.${key}`}
                        key={key}
                        values={{ value }}
                        components={{
                          value: (
                            <Typography
                              className="text-gray-500"
                              style="body2"
                            />
                          ),
                        }}
                      />
                    }
                    onClose={() => {
                      handleFilterRemove({
                        key,
                        filters,
                        history,
                        route: "/posts/my-blogs",
                      });
                    }}
                  />
                );
              })}
        </div>
        <Button
          className="bg-gray-200"
          label={t("button.clearFilter")}
          style="Secondary"
          onClick={() => history.replace("/posts/my-blogs")}
        />
      </div>
      <div
        className={classNames(
          "flex h-full w-full items-center justify-center",
          {
            hidden: !isEmpty(userBlogs),
            block: isEmpty(userBlogs),
          }
        )}
      >
        <NoData
          title={
            <Trans
              i18nKey="posts.noData"
              values={{ value: "articles" }}
              components={{
                span: <Typography component="h3" style="semibold" />,
              }}
            />
          }
        />
      </div>
      <div
        className={classNames("", {
          hidden: isEmpty(userBlogs),
          block: !isEmpty(userBlogs),
        })}
      >
        <Table
          enableColumnResize
          rowSelection
          columnData={filteredColumnData}
          rowData={userBlogs}
          selectedRowKeys={selectedRowKeys}
          onRowSelect={(selectedRowKeys, selectedRows) =>
            handleRowSelect(selectedRowKeys, selectedRows)
          }
        />
      </div>
      <SearchFilterPan
        isOpen={isSearchPanOpen}
        onClose={() => setIsSearchPanOpen(false)}
        {...{ handleFilterApplied }}
      />
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen || isSingleDeleteModalOpen}
        values={isBulkDeleteModalOpen ? { count: selectedPostsCount } : {}}
        headerMessage={
          selectedPostsCount > 1 && isBulkDeleteModalOpen
            ? t("posts.bulkDelete.header")
            : t("posts.deleteAlert.header")
        }
        setIsOpen={
          isBulkDeleteModalOpen
            ? setIsBulkDeleteModalOpen
            : setIsSingleDeleteModalOpen
        }
        subHeaderMessageKey={
          isBulkDeleteModalOpen
            ? "posts.bulkDelete.subHeader"
            : "posts.deleteAlert.subHeader"
        }
        onSubmit={isBulkDeleteModalOpen ? handleBulkDelete : handleSingleDelete}
      />
    </PageLayout>
  );
};

export default Blogs;
