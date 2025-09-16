import React from "react";

import { Typography } from "@bigbinary/neetoui";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

const Card = ({ title, description, created_at, slug }) => {
  const creationDate = dayjs(created_at).format("D MMMM YYYY");
  const history = useHistory();

  return (
    <div
      className="flex cursor-default justify-between border-b p-4"
      onClick={() => history.push(`/posts/${slug}`)}
    >
      <div className="flex flex-col gap-y-1">
        <div className="flex gap-x-2">
          <Typography style="h3" weight="semibold">
            {title}
          </Typography>
        </div>
        <Typography className="line-clamp-2 text-gray-600">
          {description}
        </Typography>
        <Typography className="text-sm text-gray-400">
          {creationDate}
        </Typography>
      </div>
    </div>
  );
};

export default Card;
