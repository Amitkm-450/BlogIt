import React, { useEffect, useState } from "react";

import { Typography } from "@bigbinary/neetoui";

import Card from "./Card";

import postsApi from "../../apis/posts";

const List = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch();
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <Typography>Loading..</Typography>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Typography className="mb-6" style="h1" weight="bold">
        Blog posts
      </Typography>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default List;
