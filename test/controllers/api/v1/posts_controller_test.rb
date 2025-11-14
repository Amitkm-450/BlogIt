# frozen_string_literal: true

require "test_helper"

class Api::V1::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @user.regenerate_authentication_token
    @headers = headers(@user)
  end

  def test_should_list_posts
    create_list(:post, 2, user: @user, organization: @organization)
    get api_v1_posts_path, headers: @headers
    assert_response :success
    assert_equal 2, response_body.length
  end

  def test_should_list_published_posts_for_organization_scope
    create_list(:post, 2, :published, user: @user, organization: @organization)
    get api_v1_posts_path, headers: @headers
    assert_response :success
    assert response_body[:posts].all? { |p| p[:status] == "published" }
  end

  def test_should_create_post
    post api_v1_posts_path,
      params: { post: { title: "Hello", description: "World" } },
      headers: @headers,
      as: :json
    assert_response :success
    assert_equal I18n.t("successfully_created", entity: I18n.t("entities.post", count: 1)), response_body[:notice]
  end

  def test_should_show_post
    post_record = create(:post, user: @user, organization: @organization)
    get api_v1_post_path(post_record.slug), headers: @headers
    assert_response :success
  end

  def test_should_update_post
    post_record = create(:post, user: @user, organization: @organization)
    patch api_v1_post_path(post_record.slug),
      params: { post: { title: "Updated" } },
      headers: @headers,
      as: :json
    assert_response :success
    assert_equal I18n.t("successfully_updated", entity: I18n.t("entities.post", count: 1), count: 1),
      response_body[:notice]
  end

  def test_should_destroy_post
    post_record = create(:post, user: @user, organization: @organization)
    delete api_v1_post_path(post_record.slug), headers: @headers
    assert_response :success
    assert_equal I18n.t("successfully_deleted", entity: I18n.t("entities.post", count: 1), count: 1),
      response_body[:notice]
  end
end
