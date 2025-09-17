import React, { useState } from "react";

import { Book, Edit, List, MenuLayout, User } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { setToLocalStorage, getFromLocalStorage } from "utils/storage";

import authApi from "../../apis/auth";
import { resetAuthTokens } from "../../apis/axios";

const Sidebar = ({ setIsCategorySidebarOpen }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/login";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="relative flex h-screen w-24 flex-col items-center gap-1 border-r-2 border-gray-200 px-1 py-2">
      <div className="flex flex-col gap-y-4">
        <Button icon={Book} size="large" style="tertiary" to="/posts" />
        <Button
          icon={List}
          size="large"
          style="secondary"
          to="/posts"
          tooltipProps={{
            content: t("sidebar.postsList"),
            position: "right",
          }}
        />
        <Button
          icon={Edit}
          size="large"
          style="secondary"
          to="/posts/new"
          tooltipProps={{
            content: t("sidebar.postCreate"),
            position: "right",
          }}
        />
        <Button
          icon={MenuLayout}
          size="large"
          style="secondary"
          tooltipProps={{
            content: t("sidebar.category"),
            position: "right",
          }}
          onClick={() => {
            setIsCategorySidebarOpen(prev => !prev);
          }}
        />
      </div>
      <Button
        className="mt-auto"
        icon={User}
        style="secondary"
        tooltipProps={{
          content: t("sidebar.profile"),
          position: "right",
        }}
        onClick={() => setIsMenuVisible(prev => !prev)}
      />
      <div
        className={classNames(
          "absolute bottom-1 left-20 z-20 mt-2 flex w-48 flex-col rounded-md border border-gray-300 bg-white px-2 py-1 shadow-xl",
          {
            block: isMenuVisible,
            hidden: !isMenuVisible,
          }
        )}
      >
        <div className="flex space-x-2">
          <Button icon={User} size="large" style="secondary" />
          <div className="flex flex-col">
            <Typography style="body2" weight="bold">
              {getFromLocalStorage("authUserName")}
            </Typography>
            <Typography className="text-gray-500 " style="body2">
              {getFromLocalStorage("authEmail")}
            </Typography>
          </div>
        </div>
        <Link
          className="block cursor-pointer px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-400"
          onClick={handleLogout}
        >
          {t("logout")}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
