# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @organization = create(:organization)
    @post = build(:post, user: @user, organization: @organization)
  end

  def test_valid_post
    assert @post.valid?
  end

  def test_title_must_be_present_and_within_limit
    @post.title = nil
    assert @post.invalid?
    assert_includes @post.errors.messages[:title], I18n.t("errors.messages.blank")

    @post.title = "a" * (Post::MAX_TITLE_LENGTH + 1)
    assert @post.invalid?
  end

  def test_description_must_be_present_and_within_limit
    @post.description = nil
    assert @post.invalid?
    assert_includes @post.errors.messages[:description], I18n.t("errors.messages.blank")

    @post.description = "a" * (Post::MAX_DESCRIPTION_LENGTH + 1)
    assert @post.invalid?
  end

  def test_is_bloggable_must_be_boolean
    @post.is_bloggable = nil
    assert @post.invalid?
  end

  def test_slug_is_unique
    create(:post, title: "Unique Title", user: @user, organization: @organization)
    duplicate_post = build(:post, title: "Unique Title", user: @user, organization: @organization)
    assert duplicate_post.valid?
  end

  def test_slug_is_generated_on_create
    post = create(:post, title: "My Cool Post", user: @user, organization: @organization)
    assert_match(/^my-cool-post/, post.slug)
  end

  def test_slug_cannot_be_changed_after_creation
    post = create(:post, title: "Original", user: @user, organization: @organization)
    post.slug = "changed-slug"
    assert post.invalid?
    assert_includes post.errors.messages[:slug], I18n.t("post.slug.immutable")
  end

  def test_net_votes_returns_sum
    post = create(:post, user: @user, organization: @organization)
    create(:vote, user: @user, post: post, value: 1)
    another_user = create(:user)
    create(:vote, user: another_user, post: post, value: -1)
    assert_equal 0, post.net_votes
  end
end
