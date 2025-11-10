# frozen_string_literal: true

require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @user.regenerate_authentication_token
    @headers = headers(@user)
  end

  def test_should_create_user
    post api_v1_users_path,
      params: {
        user: {
          name: "Sam", email: "sam@example.com", password: "welcome",
          password_confirmation: "welcome"
        }
      },
      headers: @headers,
      as: :json
    assert_response :success
    assert_equal I18n.t("successfully_created", entity: "User"), response_body[:notice]
  end

  def test_should_not_create_user_with_existing_email
    existing_user = create(:user, organization: @organization, email: "sam@example.com")

    post api_v1_users_path,
      params: {
        user: {
          name: "Sam",
          email: existing_user.email,
          password: "welcome",
          password_confirmation: "welcome"
        }
      },
      headers: @headers,
      as: :json
    assert_response :unprocessable_entity

    assert_includes response_body[:error], I18n.t("errors.messages.taken")
end
end
