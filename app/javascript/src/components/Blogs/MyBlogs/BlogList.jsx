import React, { useState } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Table as NeetoTable,
  Tooltip,
  Dropdown,
  Tag,
} from "@bigbinary/neetoui";

const BlogList = ({ posts, handleDelete, handlePublish, handleUnpublish }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const formatedPosts = posts.map(
    ({ id, slug, title, categories, updated_at, status }) => ({
      id,
      slug,
      title,
      categories,
      publishedAt: updated_at,
      status,
    })
  );

  const handleSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  const columns = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      render: (title, post) => (
        <Tooltip content={title} position="right">
          <a
            className="block max-w-xs truncate"
            href={`/posts/${post.slug}/edit`}
          >
            {title.length > 30 ? `${title.slice(0, 30)}...` : title}
          </a>
        </Tooltip>
      ),
      width: 250,
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
      render: categories =>
        categories?.length > 0
          ? categories.map(cat => (
              <Tag className="mx-1" key={cat.id}>
                {cat.name}
              </Tag>
            ))
          : "—",
    },
    {
      dataIndex: "publishedAt",
      key: "publishedAt",
      title: "Last Published At",
      width: 200,
      render: publishedAt => (
        <div className="flex items-center">
          {publishedAt ? new Date(publishedAt).toDateString() : "—"}
        </div>
      ),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      render: status => (
        <Tag type={status === "published" ? "success" : "warning"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      dataIndex: "action",
      key: "action",
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
              <MenuButton
                className="text-black"
                style="link"
                onClick={() =>
                  post.status === "published"
                    ? handleUnpublish(post.slug)
                    : handlePublish(post.slug)
                }
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                label="Delete"
                style="danger"
                type="delete"
                onClick={() => handleDelete(post.slug)}
              >
                Delete
              </MenuButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
      width: 100,
    },
  ];

  return (
    <div>
      <NeetoTable
        rowSelection
        columns={columns}
        dataSource={formatedPosts}
        selectedRowKeys={selectedRowKeys}
        onRowSelect={handleSelect}
      />
    </div>
  );
};

export default BlogList;
