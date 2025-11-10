# frozen_string_literal: true

require "test_helper"

class Api::V1::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @user.regenerate_authentication_token
    @headers = headers(@user)
  end

  def test_should_list_all_categories
    create_list(:category, 3, organization: @organization)
    get api_v1_categories_path, headers: @headers
    assert_response :success
    assert_equal Category.count, response_body[:categories].length
  end

  def test_should_create_category_with_valid_params
    post api_v1_categories_path,
      params: { category: { name: "Tech" } },
      headers: @headers,
      as: :json
    assert_response :success
    assert_equal I18n.t("successfully_created", entity: "Category"), response_body["notice"]
  end

  def test_should_not_create_category_without_name
    post api_v1_categories_path,
      params: { category: { name: nil } },
      headers: @headers,
      as: :json
    assert_response :unprocessable_content
  end
end
