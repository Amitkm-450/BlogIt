import React, { useEffect, useState } from "react";

import { Spinner, Typography } from "@bigbinary/neetoui";
import {
  Form,
  Input,
  Select,
  Textarea,
  Button,
} from "@bigbinary/neetoui/formik";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import { PostValidationSchema } from "../../constants/constant";
import { PageLayout } from "../commons";

const Edit = () => {
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [postInitialData, setPostInitialData] = useState(null);

  const history = useHistory();
  const { slug } = useParams();

  const { t } = useTranslation();

  const handleSubmit = async values => {
    try {
      await postsApi.update(slug, {
        post: {
          ...values,
          category_ids: values.categories.map(category => category.value),
        },
      });
      history.replace("/");
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCancel = () => history.goBack();

  const categoriesOption = categories?.map(category => ({
    value: category.id,
    label: category.name,
  }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await categoriesApi.fetch();
        setCategories(categories);
      } catch (error) {
        Logger.log(error);
      } finally {
        setCategoryLoading(false);
      }
    };

    const fetchPostDetails = async () => {
      setPostLoading(true);
      try {
        const { post } = await postsApi.show(slug);
        setPostInitialData({
          title: post.title || "",
          description: post.description || "",
          categories:
            post.categories?.map(category => ({
              label: category.name,
              value: category.id,
            })) || [],
        });
      } catch (error) {
        Logger.log(error);
      } finally {
        setPostLoading(false);
      }
    };

    fetchCategories();
    fetchPostDetails();
  }, []);

  if (categoryLoading || postLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-start px-4">
        <div className="flex justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.editBlogPost")}
          </Typography>
        </div>
        <div className="w-full rounded-lg bg-white p-6 shadow">
          <Form
            formikProps={{
              validateOnBlur: true,
              enableReinitialize: true,
              initialValues: postInitialData,
              validationSchema: PostValidationSchema,
              onSubmit: handleSubmit,
            }}
          >
            <div className="mb-4">
              <Input
                label={t("form.label.title")}
                name="title"
                placeholder={t("form.placeholder.title")}
                size="large"
              />
            </div>
            <div className="flex flex-col">
              <div className="mb-1 mt-1 w-full">
                <Select
                  isMulti
                  isSearchable
                  label={t("form.label.categories")}
                  menuPosition="fixed"
                  name="categories"
                  options={categoriesOption}
                  placeholder={t("form.placeholder.categories")}
                  size="large"
                />
              </div>
            </div>
            <div className="mb-4">
              <Textarea
                label={t("form.label.description")}
                name="description"
                placeholder={t("form.placeholder.description")}
                size="large"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                label={t("button.cancel")}
                style="secondary"
                onClick={handleCancel}
              />
              <Button
                className="bg-black text-white"
                label={t("button.submit")}
                type="submit"
              />
            </div>
          </Form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Edit;
