# frozen_string_literal: true

require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, password: "welcome", password_confirmation: "welcome", organization: @organization)
    @user.regenerate_authentication_token
  end

  def test_should_login_with_correct_credentials
    post api_v1_session_path,
      params: { login: { email: @user.email, password: "welcome" } },
      headers: { "Content-Type" => "application/json", Accept: "application/json" },
      as: :json

    assert_response :success
  end

  def test_should_not_login_with_wrong_password
    post api_v1_session_path,
      params: { login: { email: @user.email, password: "wrong" } },
      headers: { "Content-Type" => "application/json", Accept: "application/json" },
      as: :json

    assert_response :unauthorized
    assert_equal I18n.t("session.incorrect_credentials"), response_body[:error]
  end
end
