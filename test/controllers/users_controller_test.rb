# frozen_string_literal: true

require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    user = create(:user)
    @headers = headers(user)
  end

  def test_should_signup_user_with_valid_credentials
    post users_path, params: {
      user: {
        name: "Sam Smith",
        email: "sam@example.com",
        password: "welcome",
        password_confirmation: "welcome"
      }
    }, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created", entity: "User"), response_json["notice"]
  end

  def test_shouldnt_signup_user_with_invalid_credentials
    post users_path, params: {
      user: {
        name: "Sam Smith",
        email: "sam@example.com",
        password: "welcome",
        password_confirmation: "not matching confirmation"
      }
    }, headers: @headers

    assert_response :unprocessable_entity
    assert_equal "Password confirmation doesn't match Password", response.parsed_body["error"]
  end
end
