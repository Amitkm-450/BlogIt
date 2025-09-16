import React from "react";

import { Book, Edit, List, User } from "@bigbinary/neeto-icons";
import { Button } from "@bigbinary/neetoui";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-24 flex-col items-center gap-1 border-r-2 border-gray-200 px-1 py-2">
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
        className="mt-auto"
        icon={User}
        style="secondary"
        to="/user"
        tooltipProps={{
          content: t("sidebar.profile"),
          position: "right",
        }}
      />
    </div>
  );
};

export default Sidebar;
