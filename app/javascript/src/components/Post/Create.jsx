import React, { useState } from "react";

import { Button, Spinner, Typography } from "@bigbinary/neetoui";
import { Form, Input, Textarea } from "@bigbinary/neetoui/formik";
import Logger from "js-logger";
import { useHistory } from "react-router-dom";

import postsApi from "../../apis/posts";
import {
  PostInitialData,
  PostValidationSchema,
} from "../../constants/constant";

const Create = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await postsApi.create({
        post: values,
      });
      history.replace("/");
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => history.push("/");

  const handleChange = (event, setFieldValue) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow">
        <div className="flex justify-between">
          <Typography className="mb-4 text-2xl font-bold" style="h4">
            New blog post
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
                <Typography style="body1" weight="semibold">
                  Title*
                </Typography>
                <Input
                  name="title"
                  placeholder="Enter title"
                  value={values.title}
                  onChange={event => handleChange(event, setFieldValue)}
                />
              </div>
              <div className="mb-4">
                <Typography style="body1" weight="semibold">
                  Description*
                </Typography>
                <Textarea
                  name="description"
                  placeholder="Enter description"
                  value={values.description}
                  onChange={event => handleChange(event, setFieldValue)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  label="Cancel"
                  style="secondary"
                  onClick={handleCancel}
                />
                <Button
                  className="bg-black text-white"
                  label="Submit"
                  onClick={() => handleSubmit(values)}
                />
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Create;
