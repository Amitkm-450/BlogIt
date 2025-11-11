# frozen_string_literal: true

class Api::V1::VotesController < ApplicationController
  before_action :load_post!, only: %i[index create destroy]

  def index
    @vote = @post.votes.find_by(user: current_user)
  end

  def create
    vote = @post.votes.find_or_initialize_by(user: current_user)
    vote.value = vote_params[:value]
    vote.save!
  end

  def destroy
    vote = @post.votes.find_by(user: current_user)
    vote.destroy!
  end

  private

    def vote_params
      params.require(:vote).permit(:value)
    end

    def load_post!
      @post = current_user.organization.posts.find_by!(slug: params[:post_slug])
    end
end
