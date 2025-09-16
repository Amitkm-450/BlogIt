# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: %i[show destroy]

  def index
    posts = Post.all
    render_json(posts)
  end

  def create
    post = Post.new(post_params)
    post.save!
    render_notice("Post was successfully created")
  end

  def show
    render_json({ post: @post })
  end

  def destroy
    @post.destroy
    render_notice("Post was successfully deleted")
  end

  private

    def post_params
      params.require(:post).permit(:title, :description)
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
