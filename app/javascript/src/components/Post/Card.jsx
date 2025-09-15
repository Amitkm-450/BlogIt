import React from "react";

import { Typography } from "@bigbinary/neetoui";
import dayjs from "dayjs";

const Card = ({ title, description, created_at }) => {
  const creationDate = dayjs(created_at).format("D MMMM YYYY");

  return (
    <div className="flex justify-between border-b p-4">
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
