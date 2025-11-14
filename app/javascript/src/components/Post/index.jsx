import { PAGE_DEFAULT_NUMBER, PAGE_DEFAULT_SIZE } from "constants/query";

import React from "react";

import classNames from "classnames";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useFetchPosts } from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { filterNonNull, isNotEmpty } from "neetocist";
import { Button, NoData, Pagination, Spinner, Typography } from "neetoui";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";
import routes from "routes";

import PostCard from "./Card";

import { FilterSubHeader } from "../commons";

const List = () => {
  const { categories: queryCategories = "", page } = useQueryParams();

  const { data: { categories = [] } = {} } = useFetchCategories();

  const filterParams = {
    category_ids: categories
      .filter(({ name }) => queryCategories.split(",").includes(name))
      .map(({ id }) => id),
    ...(page && { page }),
  };

  const filters = filterNonNull({
    categories: isNotEmpty(queryCategories)
      ? queryCategories?.split(",")
      : undefined,
  });

  const {
    data: { posts = [], count: totalPostsCount = 0 } = {},
    isLoading: isPostsLoading,
  } = useFetchPosts({
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
        className={classNames("my-2 flex items-center gap-2", {
          hidden: isEmpty(queryCategories),
          block: !isEmpty(queryCategories),
        })}
      >
        <FilterSubHeader {...{ filters }} route={routes.posts.root} />
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
        className={classNames("flex h-[90%] flex-col justify-between", {
          hidden: isEmpty(posts),
          block: !isEmpty(posts),
        })}
      >
        <div className="space-y-4 overflow-y-auto">
          {posts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
        <div className="flex flex-row-reverse px-1">
          <Pagination
            count={totalPostsCount}
            pageNo={Number(page) || PAGE_DEFAULT_NUMBER}
            pageSize={PAGE_DEFAULT_SIZE}
          />
        </div>
      </div>
    </div>
  );
};
export default List;
