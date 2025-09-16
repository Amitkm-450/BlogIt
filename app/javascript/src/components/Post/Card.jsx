import React from "react";

import { Tag, Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom";

import { fromatDate } from "../../utils/date";

const Card = ({ title, user, created_at, slug, categories }) => {
  const creationDate = fromatDate(created_at);
  const history = useHistory();

  return (
    <div
      className="flex cursor-default justify-between border-b p-4"
      onClick={() => history.push(`/posts/${slug}`)}
    >
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-col gap-y-2">
          <Typography style="h3" weight="semibold">
            {title}
          </Typography>
          <div className="flex items-center justify-start gap-4">
            {categories.map(category => (
              <Tag key={category.id} label={category.name} style="success" />
            ))}
          </div>
        </div>
        <Typography className="mt-1 text-gray-600">{user.name}</Typography>
        <Typography className="text-sm text-gray-400">
          {creationDate}
        </Typography>
      </div>
    </div>
  );
};

export default Card;
