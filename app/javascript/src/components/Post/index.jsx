import React from "react";

import { Button, Spinner, Typography } from "@bigbinary/neetoui";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useFetchPosts } from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";

import PostCard from "./Card";

const List = () => {
  const { categories: queryCategories = "" } = useQueryParams();

  const { data: { categories = [] } = {} } = useFetchCategories();

  const filterParams = {
    category_ids: categories
      .filter(({ name }) => queryCategories.split(",").includes(name))
      .map(({ id }) => id),
  };

  const { data: posts = [], isLoading: isPostsLoading } = useFetchPosts({
    params: filterParams,
  });

  const { t } = useTranslation();

  if (isPostsLoading) {
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
