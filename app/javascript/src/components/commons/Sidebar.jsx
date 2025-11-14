import React, { useState } from "react";

import classNames from "classnames";
import { useLogout } from "hooks/reactQuery/useUsersApi";
import { Book, Edit, Folder, List, MenuLayout, User } from "neetoicons";
import { Button, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";
import { getFromLocalStorage } from "utils/storage";

const Sidebar = ({ setIsCategorySidebarOpen }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { t } = useTranslation();

  const history = useHistory();

  const { mutate: logoutUser } = useLogout();

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        history.push(routes.login);
      },
    });
  };

  const sidebarButtons = [
    {
      icon: Book,
      style: "tertiary",
      to: routes.posts.root,
    },
    {
      icon: List,
      style: "secondary",
      to: routes.posts.root,
      tooltipKey: "sidebar.postsList",
    },
    {
      icon: Edit,
      style: "secondary",
      to: routes.posts.new,
      tooltipKey: "sidebar.postCreate",
    },
    {
      icon: MenuLayout,
      style: "secondary",
      tooltipKey: "sidebar.category",
      onClick: () => setIsCategorySidebarOpen(prev => !prev),
    },
    {
      icon: Folder,
      style: "secondary",
      to: routes.posts.myBlogs,
      tooltipKey: "sidebar.myBlogPosts",
    },
  ];

  return (
    <div className="relative flex h-screen w-24 flex-col items-center gap-1 border-r-2 border-gray-200 px-1 py-2">
      <div className="flex flex-col gap-y-4">
        {sidebarButtons.map(
          ({ icon, style, to, onClick, tooltipKey }, index) => (
            <Button
              icon={icon}
              key={index}
              size="large"
              style={style}
              to={to}
              tooltipProps={
                tooltipKey
                  ? { content: t(tooltipKey), position: "right" }
                  : undefined
              }
              onClick={onClick}
            />
          )
        )}
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
          "absolute bottom-1 left-20 z-20 mt-2 flex w-48 flex-col gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 shadow-xl",
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
        <Button
          className="block cursor-pointer px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-400"
          label={t("logout")}
          style="secondary"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
