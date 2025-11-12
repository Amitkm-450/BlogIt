# frozen_string_literal: true

require "test_helper"

class Api::V1::MyPostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @user.regenerate_authentication_token
    @headers = headers(@user)
  end

  def test_should_list_my_posts_with_pagination
    create_list(:post, 15, user: @user, organization: @organization)

    get api_v1_my_posts_path, headers: @headers, as: :json

    assert_response :success
    assert_equal 10, response_body[:posts].length
    assert response_body[:count].positive?
  end

  def test_should_bulk_destroy_selected_posts
    posts = create_list(:post, 3, user: @user, organization: @organization)
    post_ids = posts.map(&:id)

    delete bulk_destroy_api_v1_my_posts_path,
      params: { post_ids: post_ids },
      headers: @headers,
      as: :json

    assert_response :success
    assert_equal I18n.t("successfully_deleted", entity: I18n.t("entities.post", count: 3), count: 3),
      response_body[:notice]
    assert_equal 0, Post.where(id: post_ids).count
  end

  def test_should_bulk_update_status_to_published_and_set_last_published_at
    posts = create_list(:post, 2, status: "draft", user: @user, organization: @organization)

    patch bulk_status_update_api_v1_my_posts_path,
      params: { post_ids: posts.map(&:id), post: { status: "published" } },
      headers: @headers,
      as: :json

    assert_response :success
    assert_equal I18n.t("successfully_updated", entity: I18n.t("entities.post", count: 2), count: 2),
      response_body[:notice]

    posts.each do |post|
      post.reload
      assert_equal "published", post.status
      assert_not_nil post.last_published_at
    end
  end

  def test_should_bulk_update_status_to_draft_and_not_update_last_published_at
    posts = create_list(:post, 2, status: "published", user: @user, organization: @organization)

    patch bulk_status_update_api_v1_my_posts_path,
      params: { post_ids: posts.map(&:id), post: { status: "draft" } },
      headers: @headers,
      as: :json

    assert_response :success
    assert_equal I18n.t("successfully_updated", entity: I18n.t("entities.post", count: 2), count: 2),
      response_body[:notice]

    posts.each do |post|
      post.reload
      assert_equal "draft", post.status
      assert_not_nil post.last_published_at
    end
  end
end
