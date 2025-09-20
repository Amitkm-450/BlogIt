import React, { useEffect, useState } from "react";

import { capitalize } from "@bigbinary/neeto-cist";
import { Filter, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Dropdown,
  Spinner,
  Table,
  Tooltip,
  Typography,
  Tag,
  Button,
  ActionDropdown,
  Checkbox,
} from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import SearchFilterPan from "./SearchFilterPan";

import { PageLayout } from "../commons";

const Blogs = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedRowSlugs, setSelectedRowSlugs] = useState([]);
  const [isSearchPanOpen, setIsSearchPanOpen] = useState(false);

  const columnData = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
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
      render: categories =>
        categories?.length > 0
          ? categories.map(({ id, name }) => (
              <Tag className="mx-1" key={id} label={name} />
            ))
          : "—",
    },
    {
      dataIndex: "updated_at",
      key: "updated_at",
      title: "Last Published At",
      render: updated_at => (
        <div className="flex items-center">
          {updated_at ? new Date(updated_at).toDateString() : "—"}
        </div>
      ),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: status => capitalize(status),
    },
    {
      title: "Actions",
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

  const { t } = useTranslation();

  const history = useHistory();

  const handleChange = async (slug, status) => {
    try {
      await postsApi.update({
        slug,
        payload: {
          post: {
            status,
          },
        },
        quiet: true,
      });
      history.go(0);
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCheck = title => {
    setCheckedColumns(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleDelete = async slug => {
    try {
      await postsApi.destroy(slug);
      history.replace("/posts");
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleFilterApplied = () => {};

  const handleRowSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
    // setSelectedRowSlugs(selectedRows.map(selectedRow => selectedRow.slug));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postsApi.fetch();
        setUserBlogs(response);
      } catch (error) {
        Logger.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  const filteredColumnData = columnData.filter(
    column => checkedColumns[column.title]
  );

  if (isLoading) {
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
        <div className="flex w-full items-center justify-between py-2">
          <Typography style="body2" weight="semibold">
            {selectedRowKeys.length ? selectedRowKeys.length : userBlogs.length}{" "}
            articles
          </Typography>
          <div className="flex items-center space-x-2">
            <ActionDropdown buttonStyle="secondary" label="Column">
              <ActionDropdown.Menu>
                {columnData.map(({ title }) => (
                  <ActionDropdown.MenuItem
                    key={title}
                    onClick={() => handleCheck(title)}
                  >
                    <ActionDropdown.MenuItem.Button
                      prefix={
                        <Checkbox
                          checked={checkedColumns[title]}
                          disabled={title === "Title"}
                          size={20}
                        />
                      }
                    >
                      {title}
                    </ActionDropdown.MenuItem.Button>
                  </ActionDropdown.MenuItem>
                ))}
              </ActionDropdown.Menu>
            </ActionDropdown>
            <Button
              icon={Filter}
              style="secondary"
              tooltipProps={{
                content: t("toolTip.editButton"),
                position: "top",
              }}
              onClick={() => setIsSearchPanOpen(prev => !prev)}
            />
          </div>
        </div>
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
    </PageLayout>
  );
};

export default Blogs;
