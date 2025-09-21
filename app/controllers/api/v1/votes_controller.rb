# frozen_string_literal: true

class Api::V1::VotesController < ApplicationController
  before_action :load_post!, only: %i[index create]

  BLOG_THRESHOLD = 2

  def index
    @vote = @post.votes.find_by(user: current_user)
  end

  def create
    vote = @post.votes.find_or_initialize_by(user: current_user)
    vote.value = vote_params[:value]
    vote.save!
    @post.update!(is_bloggable: @post.net_votes >= BLOG_THRESHOLD)
  end

  private

    def vote_params
      puts params
      params.require(:vote).permit(:value)
    end

    def load_post!
      @post = Post.find(params[:post_id])
      puts @post
    end
end
