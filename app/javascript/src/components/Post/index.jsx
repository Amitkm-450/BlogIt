import React from "react";

import { Button, NoData, Spinner, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useFetchPosts } from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";
import routes from "routes";

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
    <div className="h-screen w-full p-4">
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
          to={routes.posts.new}
        />
      </div>
      <div
        className={classNames("flex h-2/3 w-full items-center justify-center", {
          hidden: !isEmpty(posts),
          block: isEmpty(posts),
        })}
      >
        <NoData
          title={
            <Trans
              i18nKey="posts.noData"
              values={{ value: "posts" }}
              components={{
                span: <Typography component="h3" style="semibold" />,
              }}
            />
          }
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
