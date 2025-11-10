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
    post api_v1_votes_path,
      params: { post_id: @post.id, vote: { value: 1 } },
      headers: @headers,
      as: :json
    assert_response :success
    @post.reload
    assert_includes [true, false], @post.is_bloggable
  end

  def test_should_return_existing_vote
    create(:vote, user: @user, post: @post, value: 1)
    get api_v1_votes_path, params: { post_id: @post.id }, headers: @headers
    assert_response :success

    assert_equal 1, response_body[:vote][:user_vote]
end
end
