import React, { useEffect, useState } from "react";

import { Button, Spinner, Typography } from "@bigbinary/neetoui";
import { Form, Input, Select, Textarea } from "@bigbinary/neetoui/formik";
import Logger from "js-logger";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import {
  PostInitialData,
  PostValidationSchema,
} from "../../constants/constant";
import { PageLayout } from "../commons";

const Create = () => {
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const history = useHistory();
  const { t } = useTranslation();

  const handleSubmit = async values => {
    try {
      await postsApi.create({
        post: values,
      });
      history.replace("/");
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCancel = () => history.push("/");

  const handleChange = (event, setFieldValue) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

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

    fetchCategories();
  }, []);

  if (categoryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow">
        <div className="flex justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            {t("header.newBlogPost")}
          </Typography>
          <div className="flex items-center space-x-2" />
        </div>
        <Form
          formikProps={{
            validateOnBlur: true,
            enableReinitialize: true,
            initialValues: PostInitialData,
            validationSchema: PostValidationSchema,
          }}
        >
          {({ values, setFieldValue }) => (
            <div>
              <div className="mb-4">
                <Input
                  label={t("form.label.title")}
                  name="title"
                  placeholder={t("form.placeholder.title")}
                  size="large"
                  value={values.title}
                  onChange={event => handleChange(event, setFieldValue)}
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
                  value={values.description}
                  onChange={event => handleChange(event, setFieldValue)}
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
                  onClick={() => handleSubmit(values)}
                />
              </div>
            </div>
          )}
        </Form>
      </div>
    </PageLayout>
  );
};

export default Create;
