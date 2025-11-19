export const getCheckedColumns = (columns = []) =>
  columns.reduce((acc, { title }) => {
    acc[title] = true;

    return acc;
  }, {});

export const getTruncatedTitle = title =>
  title.length > 30 ? `${title.slice(0, 30)}...` : title;
