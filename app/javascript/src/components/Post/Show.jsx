import React, { useEffect, useState } from "react";

import { Download, Edit } from "@bigbinary/neeto-icons";
import { Avatar, Spinner, Tag, Typography, Button } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";

import DownloadModal from "./DownloadModal";

import postsApi from "../../apis/posts";
import { fromatDate } from "../../utils/date";
import { PageLayout } from "../commons";

const Show = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const { slug } = useParams();
  const history = useHistory();

  const { t } = useTranslation();

  const fetchPostDetails = async () => {
    try {
      const { post = {} } = await postsApi.show(slug);
      setPost(post);
    } catch (error) {
      logger.error(error);
      history.push("/");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [slug]);

  if (pageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const { categories, title, status, user, created_at, description } = post;

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl p-6">
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
                    block: status !== "published",
                    hidden: status === "published",
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
              <Button
                icon={Edit}
                size="large"
                style="text"
                to={`/posts/${slug}/edit`}
                tooltipProps={{
                  content: t("toolTip.editButton"),
                  position: "top",
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-gray-500">
          <div>
            <Avatar size="large" />
          </div>
          <div className="flex-col">
            <Typography className="font-bold text-black" style="body2">
              {user.name}
            </Typography>
            <Typography style="body2">{fromatDate(created_at)}</Typography>
          </div>
        </div>
        <Typography
          className="mt-4 leading-relaxed text-gray-800"
          style="body1"
        >
          {description}
        </Typography>
      </div>
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageLayout>
  );
};

export default Show;
