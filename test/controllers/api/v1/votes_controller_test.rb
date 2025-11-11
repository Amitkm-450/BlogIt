# frozen_string_literal: true

require "test_helper"

class Api::V1::VotesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @user.regenerate_authentication_token
    @post = create(:post, user: @user, organization: @organization)
    @headers = headers(@user)
  end

  def test_should_create_vote_and_update_is_bloggable
    post api_v1_post_votes_path(@post.slug),
      params: { vote: { value: 1 } },
      headers: @headers,
      as: :json

    assert_response :success
    @post.reload
    assert_includes [true, false], @post.is_bloggable
  end

  def test_should_return_existing_vote
    create(:vote, user: @user, post: @post, value: 1)

    get api_v1_post_votes_path(@post.slug),
      headers: @headers,
      as: :json

    assert_response :success
    assert_equal 1, response_body[:vote][:user_vote]
  end

  def test_should_destroy_vote
    vote = create(:vote, user: @user, post: @post, value: 1)
    assert_difference "Vote.count", -1 do
      delete api_v1_post_vote_path({ post_slug: @post.slug, id: vote.id }),
        headers: @headers,
        as: :json
    end

    assert_response :success
    assert_nil @post.votes.find_by(id: vote.id)
  end
end
