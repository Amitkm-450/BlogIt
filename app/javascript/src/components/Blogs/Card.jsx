import React from "react";

import { Typography } from "@bigbinary/neetoui";

const Card = ({ title, description, date }) => (
  <div className="border-b p-4">
    <Typography style="h3" weight="semibold">
      {title}
    </Typography>
    <Typography className="mt-1 text-gray-600">{description}</Typography>
    <Typography className="mt-2 text-sm text-gray-400">{date}</Typography>
  </div>
);

export default Card;
