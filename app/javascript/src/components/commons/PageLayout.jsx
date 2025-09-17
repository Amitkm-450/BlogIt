import React, { useState } from "react";

import CategorySidebar from "./Category";
import Sidebar from "./Sidebar";

const PageLayout = ({ children }) => {
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-shrink-0">
        <Sidebar {...{ setIsCategorySidebarOpen }} />
      </div>
      {/* <div className="h-screen w-4 bg-red-400">Sidebar2</div> */}
      <CategorySidebar {...{ isCategorySidebarOpen }} />
      <div className="flex-grow p-6">{children}</div>
    </div>
  );
};

export default PageLayout;
