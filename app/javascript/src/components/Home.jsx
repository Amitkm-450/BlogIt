import React from "react";

import PostsList from "./Post";
import Sidebar from "./Sidebar";

const Home = () => (
  <div className="flex h-screen w-screen">
    <Sidebar />
    <PostsList />
  </div>
);

export default Home;
