import React from "react";

import { Typography } from "@bigbinary/neetoui";
import { useTranslation } from "react-i18next";

import { PageLayout } from "./commons";

const Blogs = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <div className="flex flex-col items-start px-4">
        <div className="flex w-full justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.myBlogPosts")}
          </Typography>
        </div>
      </div>
    </PageLayout>
  );
};

export default Blogs;
