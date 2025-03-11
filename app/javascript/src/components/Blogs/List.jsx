import React, { useEffect, useState } from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Card from "./Card";

import postsApi from "../../apis/posts";

const List = ({ selectedCategories }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch(selectedCategories);
      logger.log(posts);
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
      <div className="flex items-center justify-between">
        <Typography className="mb-6" style="h1" weight="bold">
          Blog posts
        </Typography>
        <Button
          className="bg-black text-white"
          label="Add new blog post"
          size="medium"
          onClick={() => history.push("/posts/create")}
        />
      </div>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default List;
