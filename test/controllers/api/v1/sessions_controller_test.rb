# frozen_string_literal: true

require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user, password: "welcome", password_confirmation: "welcome")
    @user.regenerate_authentication_token
  end

  def test_should_login_with_correct_credentials
    post api_v1_session_path, # singular path
      params: { login: { email: @user.email, password: "welcome" } }.to_json,
      headers: { "Content-Type" => "application/json", Accept: "application/json" }

    assert_response :success
  end

  def test_should_not_login_with_wrong_password
    post api_v1_session_path, # singular path
      params: { login: { email: @user.email, password: "wrong" } }.to_json,
      headers: { "Content-Type" => "application/json", Accept: "application/json" }

    assert_response :unauthorized
    response_json = response.parsed_body
    assert_equal I18n.t("session.incorrect_credentials"), response_json["error"]
  end
end
