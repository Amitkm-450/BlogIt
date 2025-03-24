# frozen_string_literal: true

require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @post = create(:post, user: @user)
    @category = create(:category)
    @headers = headers(@user)
  end

  def test_should_list_all_posts
    get posts_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    all_posts = response_json["posts"]

    expected_post_ids = Post.pluck(:id).sort
    actual_post_ids = all_posts.pluck("id").sort

    assert_equal expected_post_ids, actual_post_ids
  end

  def test_should_create_valid_post
    post posts_path,
      params: {
        post: { title: "New Post", description: "Description", status: "published" },
        category_ids: [@category.id]
      },
      headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created", entity: "Post"), response_json["notice"]
  end

  def test_shouldnt_create_post_without_title
    post posts_path, params: { post: { title: "", description: "Description" } }, headers: @headers
    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_equal "Title can't be blank", response_json["error"]
  end

  def test_user_can_update_any_post_fields
    new_title = "#{@post.title}-(updated)"
    post_params = { post: { title: new_title } }

    put post_path(@post.slug), params: post_params, headers: @headers
    assert_response :success
    @post.reload
    assert_equal new_title, @post.title
  end

  def test_should_destroy_post
    assert_difference "Post.count", -1 do
      delete post_path(@post.slug), headers: @headers
    end

    assert_response :ok
  end

  def test_should_bulk_delete_posts
    post_slugs = [@post.slug]
    assert_difference "Post.count", -1 do
      delete bulk_delete_posts_path, params: { post_slugs: post_slugs }, headers: @headers
    end
    assert_response :success
  end

  def test_should_bulk_update_post_status
    post_slugs = [@post.slug]
    patch bulk_update_status_posts_path, params: { params: { post_slugs: post_slugs, status: "draft" } },
      headers: @headers
    assert_response :success
    @post.reload
    assert_equal "draft", @post.status
  end

  def test_not_found_error_rendered_for_invalid_post_slug
    invalid_slug = "invalid-slug"

    get post_path(invalid_slug), headers: @headers
    assert_response :not_found
    response_json = response.parsed_body
    assert_equal I18n.t("not_found", entity: "Post"), response_json["error"]
  end
end
