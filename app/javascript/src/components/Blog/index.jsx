import React, { useState } from "react";

import { capitalize } from "@bigbinary/neeto-cist";
import { MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Dropdown,
  Spinner,
  Table,
  Tooltip,
  Typography,
  Tag,
} from "@bigbinary/neetoui";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import {
  useFetchPosts,
  useUpdatePost,
  useDeletePost,
  useBulkDestroyPosts,
  useBulkStatusUpdate,
} from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { fromatDate } from "utils/date";
import { buildFilterParams, buildUrl } from "utils/url";

import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchFilterPan from "./SearchFilterPan";
import SubHeader from "./SubHeader";

import { PageLayout } from "../commons";

const Blogs = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
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
          ? categories.map(({ id, name }) => (
              <Tag className="mx-1" key={id} label={name} />
            ))
          : "—",
    },
    {
      dataIndex: "updatedAt",
      key: "updated_at",
      title: "Last Published At",
      width: 200,
      render: updatedAt => (
        <div className="flex items-center">
          {updatedAt ? fromatDate(updatedAt) : "—"}
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
                {post.status === "published" ? "Unpublish" : "Publish"}
              </MenuItemButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemButton
                label="Delete"
                style="danger"
                type="delete"
                onClick={() => handleDelete(post.slug)}
              >
                Delete
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

  const {
    searchTerm = "",
    status = "",
    categories: queryCategories = "",
  } = useQueryParams();

  const { data: { categories = [] } = {} } = useFetchCategories();

  const selectedCategoryIds = categories
    .filter(({ name }) => queryCategories.split(",").includes(name))
    .map(({ id }) => id);

  const filterParams = {
    ...(searchTerm && { title: searchTerm }),
    ...(selectedCategoryIds.length > 0 && {
      category_ids: selectedCategoryIds,
    }),
    ...(status && { status }),
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
    deletePost(slug);
  };

  const handleBulkDelete = () => {
    bulkDestroyPosts(selectedRowIds, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
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

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  const filteredColumnData = columnData.filter(
    column => checkedColumns[column.title]
  );

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
            handleDelete,
            handleChange,
            handleCheck,
            checkedColumns,
            handleBulkUpdate,
            setIsDeleteModalOpen,
          }}
        />
      </div>
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
      <SearchFilterPan
        isOpen={isSearchPanOpen}
        onClose={() => setIsSearchPanOpen(false)}
        {...{ handleFilterApplied }}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        {...{ handleBulkDelete }}
      />
    </PageLayout>
  );
};

export default Blogs;
