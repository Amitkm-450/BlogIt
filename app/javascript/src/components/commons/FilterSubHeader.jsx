import React from "react";

import useQueryParams from "hooks/useQueryParams";
import { capitalize } from "neetocist";
import { Tag, Typography } from "neetoui";
import { isEmpty } from "ramda";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import { handleFilterRemove } from "utils/url";

const FilterSubHeader = ({ filters, route }) => {
  const { page } = useQueryParams();

  const history = useHistory();

  return (
    <div className="flex items-center space-x-3 py-2">
      {Array.isArray(filters.categories) &&
        filters.categories.map(category => (
          <Tag
            key={category}
            style="danger"
            label={
              <Trans
                i18nKey="posts.filters.category"
                values={{ value: category }}
                components={{
                  value: <Typography className="text-gray-500" style="body2" />,
                }}
              />
            }
            onClose={() =>
              handleFilterRemove({
                key: "categories",
                valueToRemove: category,
                filters,
                page,
                history,
                route,
              })
            }
          />
        ))}
      {!isEmpty(filters) &&
        Object.entries(filters)
          .filter(([key, value]) => key !== "categories" && Boolean(value))
          .map(([key, value]) => {
            if (key === "status") value = capitalize(value);

            return (
              <Tag
                key={key}
                style="secondary"
                label={
                  <Trans
                    i18nKey={`posts.filters.${key}`}
                    key={key}
                    values={{ value }}
                    components={{
                      value: (
                        <Typography className="text-gray-500" style="body2" />
                      ),
                    }}
                  />
                }
                onClose={() => {
                  handleFilterRemove({
                    key,
                    filters,
                    page,
                    history,
                    route,
                  });
                }}
              />
            );
          })}
    </div>
  );
};

export default FilterSubHeader;
