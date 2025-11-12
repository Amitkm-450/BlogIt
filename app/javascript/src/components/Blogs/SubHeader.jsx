import { POST_STATUS } from "constants/post";

import React from "react";

import { Delete, Filter } from "@bigbinary/neeto-icons";
import {
  ActionDropdown,
  Button,
  Checkbox,
  Dropdown,
  Typography,
} from "@bigbinary/neetoui";
import classNames from "classnames";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";

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

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

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
            block: selectedRowKeys.length !== 0,
            hidden: selectedRowKeys.length === 0,
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
