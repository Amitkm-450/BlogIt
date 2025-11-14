import { PAGE_DEFAULT_NUMBER, PAGE_DEFAULT_SIZE } from "constants/query";

import React, { useState } from "react";

import classNames from "classnames";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import {
  useFetchMyPosts,
  useBulkDestroyMyPosts,
  useBulkStatusUpdateMyPosts,
} from "hooks/reactQuery/useMyPostsApi";
import { useUpdatePost, useDeletePost } from "hooks/reactQuery/usePostsApi";
import useQueryParams from "hooks/useQueryParams";
import { filterNonNull, isNotEmpty } from "neetocist";
import { Spinner, Table, Typography, NoData, Pagination } from "neetoui";
import { isEmpty } from "ramda";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";
import { getCheckedColumns } from "utils/post";
import { buildFilterParams, buildUrl } from "utils/url";

import { getPostsColumns } from "./getColumns";
import SearchFilterPane from "./SearchFilterPane";
import SubHeader from "./SubHeader";

import {
  DeleteConfirmationModal,
  FilterSubHeader,
  PageLayout,
} from "../commons";

const Blogs = () => {
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isSingleDeleteModalOpen, setIsSingleDeleteModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedPostSlug, setSelectedPostSlug] = useState("");
  const [isSearchPanOpen, setIsSearchPanOpen] = useState(false);

  const history = useHistory();

  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const {
    searchTerm = "",
    status = "",
    categories: queryCategories = "",
    page,
  } = queryParams;

  const shouldShowFilters =
    isEmpty(selectedRowIds) &&
    Object.keys(queryParams)
      .filter(key => key !== "page")
      .some(key => Boolean(queryParams[key]));

  const { data: { categories = [] } = {} } = useFetchCategories();

  const selectedCategoryIds = categories
    .filter(({ name }) => queryCategories?.split(",").includes(name))
    .map(({ id }) => id);

  const normalizedFilters = {
    title: searchTerm || undefined,
    category_ids: isNotEmpty(selectedCategoryIds)
      ? selectedCategoryIds
      : undefined,
    status: status || undefined,
    page: page || undefined,
  };

  const filterParams = filterNonNull(normalizedFilters);

  const filters = filterNonNull({
    searchTerm: searchTerm || undefined,
    status: status || undefined,
    categories: isNotEmpty(queryCategories)
      ? queryCategories?.split(",")
      : undefined,
  });

  const {
    data: { posts: userBlogs = [], count: totalPostsCount = 0 } = {},
    isLoading: isPostsLoading,
  } = useFetchMyPosts(filterParams);

  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: bulkDestroyPosts } = useBulkDestroyMyPosts();
  const { mutate: bulkStatusUpdate } = useBulkStatusUpdateMyPosts();

  const handleChange = (slug, status) => {
    updatePost({
      slug,
      payload: {
        status,
      },
      quiet: true,
    });
  };

  const handleDelete = slug => {
    setIsSingleDeleteModalOpen(true);
    setSelectedPostSlug(slug);
  };

  const columnData = getPostsColumns({ handleChange, handleDelete });
  const [checkedColumns, setCheckedColumns] = useState(() =>
    getCheckedColumns(columnData)
  );

  const handleCheck = title => {
    setCheckedColumns(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleResetRows = () => {
    setSelectedRowKeys([]);
    setSelectedRowIds([]);
  };

  const handleBulkDelete = () => {
    bulkDestroyPosts(selectedRowIds, {
      onSuccess: () => {
        handleResetRows();
      },
    });
  };

  const handleBulkUpdate = status => {
    bulkStatusUpdate(
      { postIds: selectedRowIds, status },
      {
        onSuccess: () => {
          handleResetRows();
        },
      }
    );
  };

  const handleFilterApplied = values => {
    handleResetRows();

    const searchParams = buildFilterParams(values);

    const url = buildUrl(routes.posts.myBlogs, searchParams);
    history.replace(url);
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowIds(selectedRows.map(selectedRow => selectedRow.id));
  };

  const handleSingleDelete = () => {
    deletePost(selectedPostSlug, {
      onSuccess: () => {
        handleResetRows();
      },
    });
  };

  const filteredColumnData = columnData.filter(
    column => checkedColumns[column.title]
  );

  const selectedPostsCount = selectedRowKeys.length;

  if (isPostsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-start px-4">
        <div className="flex w-full justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.myBlogPosts")}
          </Typography>
        </div>
        <SubHeader
          {...{
            setIsSearchPanOpen,
            selectedRowKeys,
            totalPostsCount,
            handleCheck,
            checkedColumns,
            handleBulkUpdate,
            columnData,
          }}
          setIsDeleteModalOpen={setIsBulkDeleteModalOpen}
        />
      </div>
      <div
        className={classNames("flex items-center space-x-8", {
          hidden: !shouldShowFilters,
          block: shouldShowFilters,
        })}
      >
        <FilterSubHeader {...{ filters }} route={routes.posts.myBlogs} />
      </div>
      <div
        className={classNames(
          "flex h-full w-full items-center justify-center",
          {
            hidden: !isEmpty(userBlogs),
            block: isEmpty(userBlogs),
          }
        )}
      >
        <NoData
          title={
            <Trans
              i18nKey="posts.noData"
              values={{ value: "articles" }}
              components={{
                span: <Typography component="h3" style="semibold" />,
              }}
            />
          }
        />
      </div>
      <div
        className={classNames("flex h-[90%] flex-col justify-between pb-4", {
          hidden: isEmpty(userBlogs),
          block: !isEmpty(userBlogs),
        })}
      >
        <Table
          rowSelection
          columnData={filteredColumnData}
          enableColumnResize={false}
          rowData={userBlogs}
          selectedRowKeys={selectedRowKeys}
          onRowSelect={(selectedRowKeys, selectedRows) =>
            handleRowSelect(selectedRowKeys, selectedRows)
          }
        />
        <div className="flex flex-row-reverse px-1">
          <Pagination
            count={totalPostsCount}
            pageNo={Number(page) || PAGE_DEFAULT_NUMBER}
            pageSize={PAGE_DEFAULT_SIZE}
          />
        </div>
      </div>
      <SearchFilterPane
        isOpen={isSearchPanOpen}
        onClose={() => setIsSearchPanOpen(false)}
        {...{ handleFilterApplied }}
      />
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen || isSingleDeleteModalOpen}
        values={isBulkDeleteModalOpen ? { count: selectedPostsCount } : {}}
        headerMessage={
          selectedPostsCount > 1 && isBulkDeleteModalOpen
            ? t("posts.bulkDelete.header")
            : t("posts.deleteAlert.header")
        }
        setIsOpen={
          isBulkDeleteModalOpen
            ? setIsBulkDeleteModalOpen
            : setIsSingleDeleteModalOpen
        }
        subHeaderMessageKey={
          isBulkDeleteModalOpen
            ? "posts.bulkDelete.subHeader"
            : "posts.deleteAlert.subHeader"
        }
        onSubmit={isBulkDeleteModalOpen ? handleBulkDelete : handleSingleDelete}
      />
    </PageLayout>
  );
};

export default Blogs;
