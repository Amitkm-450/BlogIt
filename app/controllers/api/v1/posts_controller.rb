# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  def index
    posts = Post.all
    render json: posts
  end

  def create
    puts "=============== Inside the Post::Create ================"
    post = Post.new(post_params)
    puts "=============== Validate the Post::Create ================"
    puts "#{post.valid?}"
    post.save!
    render_notice("Post was successfully created")
  end

  private

    def post_params
      params.require(:post).permit(:title, :description)
    end
end
