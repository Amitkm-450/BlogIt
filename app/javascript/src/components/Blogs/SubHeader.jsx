import { POST_STATUS } from "constants/post";

import React from "react";

import classNames from "classnames";
import { Delete, Filter } from "neetoicons";
import {
  ActionDropdown,
  Button,
  Checkbox,
  Dropdown,
  Typography,
} from "neetoui";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";

const { Menu, MenuItem, Divider } = Dropdown;
const { Button: MenuItemButton } = MenuItem;

const { Menu: ActionMenu, MenuItem: ActionMenuItem } = ActionDropdown;
const { Button: ActionMenuItemButton } = ActionMenuItem;

const SubHeader = ({
  setIsSearchPanOpen,
  selectedRowKeys,
  totalPostsCount,
  columnData,
  handleCheck,
  checkedColumns,
  handleBulkUpdate,
  setIsDeleteModalOpen,
}) => {
  const { t } = useTranslation();

  const selectedCount = selectedRowKeys.length;
  const hasSelection = !isEmpty(selectedRowKeys);

  let translationKey = "posts.articlesCount";
  let translationValues = { count: totalPostsCount };

  if (hasSelection) {
    translationKey = "posts.articlesSelected";
    translationValues = { count: selectedCount, total: totalPostsCount };
  }

  return (
    <div className="flex w-full items-center justify-between py-2">
      <div className="flex items-center space-x-4">
        <Trans
          i18nKey={translationKey}
          values={translationValues}
          components={{
            span: <Typography style="body2" weight="semibold" />,
          }}
        />
        <div
          className={classNames("flex space-x-2", {
            block: hasSelection,
            hidden: !hasSelection,
          })}
        >
          <Dropdown
            buttonStyle="secondary"
            label={t("subHeader.bulkUpdate")}
            position="bottom-end"
            strategy="fixed"
          >
            <Menu>
              <MenuItem>
                <MenuItemButton
                  className="text-black"
                  style="link"
                  onClick={() => handleBulkUpdate(POST_STATUS.DRAFT)}
                >
                  {t("subHeader.status.draft")}
                </MenuItemButton>
              </MenuItem>
              <Divider />
              <MenuItem>
                <MenuItemButton
                  className="text-black"
                  style="link"
                  onClick={() => handleBulkUpdate(POST_STATUS.PUBLISHED)}
                >
                  {t("subHeader.status.publish")}
                </MenuItemButton>
              </MenuItem>
            </Menu>
          </Dropdown>
          <Button
            className="bg-red-200"
            icon={() => <Delete />}
            label={t("subHeader.bulkDelete")}
            size="small"
            style="danger-text"
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ActionDropdown buttonStyle="secondary" label={t("subHeader.column")}>
          <ActionMenu>
            {columnData.map(({ title }) => (
              <ActionMenuItem key={title} onClick={() => handleCheck(title)}>
                <ActionMenuItemButton
                  prefix={
                    <Checkbox
                      checked={checkedColumns[title]}
                      disabled={title === "Title"}
                      size={20}
                    />
                  }
                >
                  {title}
                </ActionMenuItemButton>
              </ActionMenuItem>
            ))}
          </ActionMenu>
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
