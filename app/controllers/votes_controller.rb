# frozen_string_literal: true

class VotesController < ApplicationController
  def create
    post = Post.find(params[:post_slug])
    existing_vote = post.votes.find_by(user: current_user)

    if existing_vote
      post.decrement!(:upvotes) if existing_vote.vote_type == "upvote"
      post.decrement!(:downvotes) if existing_vote.vote_type == "downvote"

      if existing_vote.vote_type != params[:vote_type]
        existing_vote.update!(vote_type: params[:vote_type])
      end
    else
      post.votes.create!(user: current_user, vote_type: params[:vote_type])
    end

    if params[:vote_type] == "upvote"
      post.increment!(:upvotes)
    elsif params[:vote_type] == "downvote"
      post.increment!(:downvotes)
    end

    render status: :ok, json: {
      net_votes: post.upvotes - post.downvotes,
      user_vote: post.votes.find_by(user: current_user)&.vote_type
    }
  end
end
