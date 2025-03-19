# frozen_string_literal: true

class PostsController < ApplicationController
  def index
    posts = Post.includes(:categories, :user)

    posts = PostFilterService.new(posts, params, current_user).process!

    render status: :ok, json: { posts: posts.as_json(include: [:categories], methods: [:author_name, :net_votes]) }
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
    user_vote = post.votes.find_by(user: current_user)&.vote_type
    render status: :ok, json: { post: post.as_json(include: [:categories, :user]), user_vote: user_vote }
  end

  def destroy
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.destroy!
    render_notice(t("successfully_deleted", entity: "Post"))
  end

  def bulk_delete
    posts = Post.where(slug: params[:post_slugs])
    authorize posts, :bulk_delete?
    posts.destroy_all
    render_notice(t("successfully_deleted", entity: "Posts"))
  end

  def bulk_update_status
    posts = Post.where(slug: params[:params][:post_slugs])

    authorize posts, :bulk_update_status?

    posts.each do |post|
      next if post.status == params[:params][:status]

      post.update!(status: params[:params][:status])
    end

    render_notice(t("successfully_updated", entity: "Posts"))
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :status, category_ids: [], post_slugs: [])
    end
end
