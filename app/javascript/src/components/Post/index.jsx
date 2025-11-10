import React from "react";

import { Button, NoData, Spinner, Tag, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useFetchPosts } from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";
import { handleFilterRemove } from "utils/url";

import PostCard from "./Card";

const List = () => {
  const { categories: queryCategories = "" } = useQueryParams();

  const history = useHistory();

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
      <div
        className={classNames("my-2 flex items-center gap-2", {
          hidden: isEmpty(queryCategories),
          block: !isEmpty(queryCategories),
        })}
      >
        <Tag
          style="secondary"
          label={
            <Trans
              i18nKey="posts.filters.categories"
              values={{ value: queryCategories }}
              components={{
                value: <Typography className="text-gray-500" style="body3" />,
              }}
            />
          }
          onClose={() => {
            handleFilterRemove({
              key: "categories",
              filters: { categories: queryCategories },
              history,
              route: routes.posts.root,
            });
          }}
        />
        <Button
          className="bg-gray-200"
          label={t("button.clearFilter")}
          style="Secondary"
          onClick={() => history.replace(routes.posts.root)}
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
