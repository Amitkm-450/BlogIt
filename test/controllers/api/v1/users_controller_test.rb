# frozen_string_literal: true

require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
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
      }.to_json,
      headers: @headers
    assert_response :success
    assert_equal I18n.t("successfully_created", entity: "User"), response.parsed_body["notice"]
  end
end
