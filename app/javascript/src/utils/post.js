export const getCheckedColumns = (columns = []) =>
  columns.reduce((acc, { title }) => {
    acc[title] = true;

    return acc;
  }, {});
