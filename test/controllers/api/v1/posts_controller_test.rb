# frozen_string_literal: true

require "test_helper"

class Api::V1::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @user.regenerate_authentication_token
    @organization = create(:organization)
    @headers = headers(@user)
  end

  def test_should_create_post
    post api_v1_posts_path,
      params: { post: { title: "Hello", description: "World", organization_id: @organization.id } }.to_json,
      headers: @headers
    assert_response :success
    assert_equal I18n.t("successfully_created", entity: "Post"), response.parsed_body["notice"]
  end

  def test_should_show_post
    post_record = create(:post, user: @user, organization: @organization)
    get api_v1_post_path(post_record.slug), headers: @headers
    assert_response :success
  end

  def test_should_update_post
    post_record = create(:post, user: @user, organization: @organization)
    patch api_v1_post_path(post_record.slug),
      params: { post: { title: "Updated" } }.to_json,
      headers: @headers
    assert_response :success
    assert_equal "Post was successfully updated", response.parsed_body["notice"]
  end

  def test_should_destroy_post
    post_record = create(:post, user: @user, organization: @organization)
    delete api_v1_post_path(post_record.slug), headers: @headers
    assert_response :success
    assert_equal "Post was successfully deleted", response.parsed_body["notice"]
  end
end
