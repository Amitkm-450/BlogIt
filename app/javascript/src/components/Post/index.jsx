import React, { useEffect, useState } from "react";

import { Button, Spinner, Typography } from "@bigbinary/neetoui";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";

import PostCard from "./Card";

import postsApi from "../../apis/posts";

const List = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsApi.fetch();
        setPosts(response);
      } catch (error) {
        Logger.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between px-4">
        <Typography
          className="flex items-center justify-center"
          style="h1"
          weight="bold"
        >
          {t("header.blogPosts")}
        </Typography>
        <Button
          className="bg-black text-white"
          label={t("button.addNewBlog")}
          style="secondary"
          to="/posts/new"
        />
      </div>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
};
export default List;
