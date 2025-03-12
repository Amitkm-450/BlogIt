# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @organization = Organization.create!(name: "Test Org")
    @user = User.create!(
      name: "Test User", email: "test@example.com", password: "password",
      password_confirmation: "password", organization: @organization)
    @post = Post.new(
      title: "Test Post", description: "This is a test description.", user: @user,
      organization: @organization, is_bloggable: true, slug: "test-post")
  end

  def test_post_should_be_valid_with_valid_attributes
    assert @post.valid?
  end

  def test_post_should_not_be_valid_without_title
    @post.title = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title can't be blank"
  end

  def test_post_should_not_be_valid_with_long_title
    @post.title = "A" * 126
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title is too long (maximum is 125 characters)"
  end

  def test_post_should_not_be_valid_without_description
    @post.description = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description can't be blank"
  end

  def test_post_should_have_unique_slug
    @post.save
    duplicate_post = @post.dup
    assert_not duplicate_post.valid?
    assert_includes duplicate_post.errors.full_messages, "Slug has already been taken"
  end
end
