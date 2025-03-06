import React from "react";

import List from "./List";

import { Sidebar } from "../commons";

const BlogPage = () => (
  <div className="flex h-screen">
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Sidebar />
      </div>
      <List />
    </div>
  </div>
);

export default BlogPage;
