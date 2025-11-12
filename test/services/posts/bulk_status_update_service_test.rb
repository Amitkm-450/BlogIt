# frozen_string_literal: true

require "test_helper"

class Posts::BulkStatusUpdateServiceTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)

    @draft_post1 = create(:post, status: "draft", user: @user, organization: @organization)
    @draft_post2 = create(:post, status: "draft", user: @user, organization: @organization)
    @published_post = create(
      :post,
      status: "published",
      user: @user,
      organization: @organization,
    )
  end

  def test_updates_non_published_posts_to_published_and_sets_last_published_at
    service = Posts::BulkStatusUpdateService.new(Post.all, "published")
    service.process

    assert_nil @draft_post1.last_published_at
    assert_nil @draft_post2.last_published_at

    @draft_post1.reload
    @draft_post2.reload
    @published_post.reload

    assert_equal "published", @draft_post1.status
    assert_equal "published", @draft_post2.status

    assert_not_nil @draft_post1.last_published_at
    assert_not_nil @draft_post2.last_published_at
  end

  def test_updates_non_draft_posts_to_draft_without_changing_last_published_at
    original_published_time = @published_post.last_published_at
    service = Posts::BulkStatusUpdateService.new(Post.all, "draft")
    service.process

    @draft_post1.reload
    @draft_post2.reload
    @published_post.reload

    assert_equal "draft", @draft_post1.status
    assert_equal "draft", @published_post.status
    assert_in_delta original_published_time.to_f, @published_post.last_published_at.to_f, 2
  end

  def test_does_nothing_when_all_posts_already_have_the_target_status
    service = Posts::BulkStatusUpdateService.new(Post.where(status: "draft"), "draft")

    assert_no_changes -> { Post.maximum(:updated_at) } do
      service.process
    end
  end
end
