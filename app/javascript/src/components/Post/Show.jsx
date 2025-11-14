import { POST_STATUS } from "constants/post";

import React, { useState } from "react";

import { Download, Edit } from "@bigbinary/neeto-icons";
import { Avatar, Spinner, Tag, Typography, Button } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useFetchPost } from "hooks/reactQuery/usePostsApi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import routes from "routes";
import { formatDate } from "utils/date";
import { getFromLocalStorage } from "utils/storage";
import { buildUrl } from "utils/url";

import DownloadModal from "./DownloadModal";

import { PageLayout } from "../commons";

const Show = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { slug } = useParams();

  const { t } = useTranslation();

  const { data: { post = {} } = {}, isLoading } = useFetchPost(slug);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const {
    categories,
    title,
    status,
    user: { id: userId = "", name: userName = "" },
    lastPublishedAt,
    description,
  } = post;

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex space-x-2">
          {categories?.map(({ id, name }) => (
            <Tag className="bg-gray-100 text-gray-700" key={id} label={name} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex w-full justify-between">
            <div className="flex items-center space-x-4">
              <Typography className="font-bold" style="h1">
                {title}
              </Typography>
              <div>
                <Tag
                  label={status}
                  size="large"
                  style="warning"
                  className={classNames({
                    block: status !== POST_STATUS.PUBLISHED,
                    hidden: status === POST_STATUS.PUBLISHED,
                  })}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                icon={Download}
                size="large"
                style="text"
                tooltipProps={{
                  content: t("toolTip.downloadButton"),
                  position: "top",
                }}
                onClick={() => setIsModalOpen(true)}
              />
              {userId === getFromLocalStorage("authUserId") && (
                <Button
                  icon={Edit}
                  size="large"
                  style="text"
                  to={buildUrl(routes.posts.edit, { slug })}
                  tooltipProps={{
                    content: t("toolTip.editButton"),
                    position: "top",
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-gray-500">
          <div>
            <Avatar size="large" />
          </div>
          <div className="flex-col">
            <Typography className="font-bold text-black" style="body2">
              {userName}
            </Typography>
            <Typography style="body2">
              {lastPublishedAt
                ? formatDate(lastPublishedAt)
                : t("posts.notPublishedYet")}
            </Typography>
          </div>
        </div>
        <Typography
          className="mt-4 leading-relaxed text-gray-800"
          style="body1"
        >
          {description}
        </Typography>
      </div>
      {isModalOpen && (
        <DownloadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          {...{ slug }}
        />
      )}
    </PageLayout>
  );
};

export default Show;
