import { POST_STATUS } from "constants/post";

import React from "react";

import i18n from "common/i18n";
import dayjs from "dayjs";
import { capitalize } from "neetocist";
import { MenuHorizontal } from "neetoicons";
import { Dropdown, Tooltip } from "neetoui";
import routes from "routes";
import { buildUrl } from "utils/url";

const { Menu, MenuItem, Divider } = Dropdown;
const { Button: MenuItemButton } = MenuItem;

export const getPostsColumns = ({ handleChange, handleDelete }) => [
  {
    dataIndex: "title",
    key: "title",
    title: i18n.t("posts.table.title"),
    width: 100,
    render: (title, post) => {
      const displayTitle =
        title.length > 30 ? `${title.slice(0, 30)}...` : title;

      const link = (
        <a
          className="block max-w-xs truncate"
          href={buildUrl(routes.posts.edit, { slug: post.slug })}
        >
          {displayTitle}
        </a>
      );

      return title.length > 30 ? (
        <Tooltip content={title} position="right">
          {link}
        </Tooltip>
      ) : (
        link
      );
    },
  },
  {
    title: i18n.t("posts.table.category"),
    dataIndex: "categories",
    key: "categories",
    width: 200,
    render: categories =>
      categories?.length > 0
        ? categories.map(({ name }) => name).join(", ")
        : "—",
  },
  {
    dataIndex: "lastPublishedAt",
    key: "lastPublishedAt",
    title: i18n.t("posts.table.lastPublishedAt"),
    width: 200,
    render: lastPublishedAt => (
      <div className="flex items-center">
        {lastPublishedAt
          ? dayjs(lastPublishedAt).format("MMMM D, YYYY, hh.mm A")
          : i18n.t("posts.table.empty")}
      </div>
    ),
  },
  {
    dataIndex: "status",
    key: "status",
    title: i18n.t("posts.table.status"),
    width: 100,
    render: status => capitalize(status),
  },
  {
    title: i18n.t("posts.table.actions"),
    width: 50,
    render: (_, { status, slug }) => (
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
                status === POST_STATUS.PUBLISHED
                  ? handleChange(slug, POST_STATUS.DRAFT)
                  : handleChange(slug, POST_STATUS.PUBLISHED)
              }
            >
              {status === POST_STATUS.PUBLISHED
                ? i18n.t("posts.actions.unpublish")
                : i18n.t("posts.actions.publish")}
            </MenuItemButton>
          </MenuItem>
          <Divider />
          <MenuItem>
            <MenuItemButton
              style="danger"
              type="delete"
              onClick={() => handleDelete(slug)}
            >
              {i18n.t("posts.actions.delete")}
            </MenuItemButton>
          </MenuItem>
        </Menu>
      </Dropdown>
    ),
  },
];
