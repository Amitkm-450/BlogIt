import { POST_STATUS } from "constants/post";

import React, { useEffect, useState } from "react";

import { Avatar, Tag, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { formatDate } from "utils/date";

import { PageLayout } from "../../commons";

const Preview = () => {
  const [post, setPost] = useState({});

  const { t } = useTranslation();
  const { slug } = useParams();

  useEffect(() => {
    const data = localStorage.getItem(`preview_post_${slug}`);
    if (data) {
      setPost(JSON.parse(data));
    }
  }, [slug]);

  const { categories, title, status, user, updatedAt, description } = post;

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-1 flex w-full justify-center rounded-md bg-gray-200 py-1">
          <Typography style="body1">{t("header.previewPost")}</Typography>
        </div>
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
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-gray-500">
          <div>
            <Avatar size="large" />
          </div>
          <div className="flex-col">
            <Typography className="font-bold text-black" style="body2">
              {user?.name}
            </Typography>
            <Typography style="body2">{formatDate(updatedAt)}</Typography>
          </div>
        </div>
        <Typography
          className="mt-4 leading-relaxed text-gray-800"
          style="body1"
        >
          {description}
        </Typography>
      </div>
    </PageLayout>
  );
};

export default Preview;
