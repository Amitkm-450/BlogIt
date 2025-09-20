import React from "react";

import { capitalize } from "@bigbinary/neeto-cist";
import { Filter, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  ActionDropdown,
  Button,
  Checkbox,
  Dropdown,
  Tag,
  Tooltip,
  Typography,
} from "@bigbinary/neetoui";
import { useTranslation } from "react-i18next";

const SubHeader = ({
  setIsSearchPanOpen,
  selectedRowKeys,
  userBlogs,
  handleDelete,
  handleChange,
  handleCheck,
  checkedColumns,
}) => {
  const { t } = useTranslation();

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

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  return (
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
  );
};

export default SubHeader;
