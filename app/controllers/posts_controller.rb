# frozen_string_literal: true

class PostsController < ApplicationController
  def index
    posts = Post.includes(:categories, :user)

    if params[:category_ids].present?
      posts = posts.joins(:categories).where(categories: { id: params[:category_ids] }).distinct
    end

    render status: :ok, json: { posts: posts.as_json(include: [:categories], methods: [:author_name]) }
  end

  def create
    post = Post.new(post_params)
    post.save!
    post.categories << Category.where(id: params[:category_ids])
    render_notice(t("successfully_created", entity: "Post"))
  end

  def show
    post = Post.find_by!(slug: params[:slug])
    render_json({ post: post })
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, category_ids: [])
    end
end
