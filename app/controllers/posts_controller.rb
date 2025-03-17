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
    post.user = @current_user
    post.organization = @current_user.organization
    post.save!
    post.categories << Category.where(id: params[:category_ids])
    render_notice(t("successfully_created", entity: "Post"))
  end

  def update
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.update(post_params)
    post.categories = Category.where(id: params[:category_ids]) if params[:category_ids].present?
    render_notice(t("successfully_updated", entity: "Post"))
  end

  def show
    post = Post.find_by!(slug: params[:slug])
    authorize post
    render status: :ok, json: { post: post.as_json(include: [:categories, :user]) }
  end

  def destroy
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.destroy!
    render_notice(t("successfully_deleted", entity: "Post"))
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :status, category_ids: [])
    end
end
