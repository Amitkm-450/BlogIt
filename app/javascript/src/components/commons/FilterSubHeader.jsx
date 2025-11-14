import React from "react";

import useQueryParams from "hooks/useQueryParams";
import { capitalize } from "neetocist";
import { Tag, Typography } from "neetoui";
import { isEmpty } from "ramda";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";
import { handleFilterRemove } from "utils/url";

const FilterSubHeader = ({ filters }) => {
  const { page } = useQueryParams();

  const history = useHistory();

  return (
    <div className="flex items-center space-x-3 py-2">
      {!isEmpty(filters) &&
        Object.entries(filters)
          .filter(([_, value]) => Boolean(value))
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
                    route: routes.posts.myBlogs,
                  });
                }}
              />
            );
          })}
    </div>
  );
};

export default FilterSubHeader;
