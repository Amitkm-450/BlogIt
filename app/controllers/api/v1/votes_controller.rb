# frozen_string_literal: true

class Api::V1::VotesController < ApplicationController
  before_action :load_post!, only: %i[create]

  def create
    vote = @post.votes.find_or_initialize_by(user: current_user)
    vote.value = vote_params[:value]
    vote.save!
    @post.update!(is_bloggable: @post.net_votes >= BLOG_THRESHOLD)
    render_json({ net_votes: @post.net_votes })
  end

  private

    def vote_params
      params.require(:vote).permit(:post_id, :value)
    end

    def load_post!
      @post = Post.find(vote_params[:post_id])
    end
end
