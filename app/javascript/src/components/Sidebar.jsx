import React from "react";

import { Book, List, User } from "@bigbinary/neeto-icons";
import { Button } from "@bigbinary/neetoui";

const Sidebar = () => (
  <div className="flex h-screen w-24 flex-col items-center gap-1 border-r-2 border-gray-200 px-1 py-2">
    <Button icon={Book} size="large" style="tertiary" to="/" />
    <Button
      icon={List}
      size="large"
      style="secondary"
      to="/posts"
      tooltipProps={{
        content: "Posts List",
        position: "right",
      }}
    />
    <Button
      className="mt-auto"
      icon={User}
      style="secondary"
      to="/user"
      tooltipProps={{
        content: "Profile",
        position: "right",
      }}
    />
  </div>
);

export default Sidebar;
