import React from "react";

import Sidebar from "./Sidebar";

const PageLayout = ({ children }) => (
  <div className="flex h-screen w-screen">
    <div className="flex-shrink-0">
      <Sidebar />
    </div>
    <div className="flex-grow p-6">{children}</div>
  </div>
);

export default PageLayout;
