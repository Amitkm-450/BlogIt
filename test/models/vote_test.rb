# frozen_string_literal: true

require "test_helper"

class VoteTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @organization = create(:organization)
    @post = create(:post, user: @user, organization: @organization)
    @vote = build(:vote, user: @user, post: @post, value: 1)
  end

  def test_valid_vote
    assert @vote.valid?
  end

  def test_value_must_be_either_1_or_minus_1
    @vote.value = 0
    assert @vote.invalid?
    assert_includes @vote.errors.messages[:value], I18n.t("errors.messages.inclusion")
  end

  def test_user_can_vote_only_once_per_post
    create(:vote, user: @user, post: @post, value: 1)
    duplicate_vote = build(:vote, user: @user, post: @post, value: -1)
    assert duplicate_vote.invalid?
    assert_includes duplicate_vote.errors.messages[:user_id], "can vote only once per post"
  end
end
