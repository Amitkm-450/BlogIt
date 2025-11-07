# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: %i[show destroy update]
  before_action :load_posts!, only: %i[index bulk_destroy bulk_status_update]

  def index
    @posts = @posts.includes(:user, :organization, :categories)
    @posts = Posts::FilterService.new(@posts, params).process
  end

  def create
    post = current_user.posts.build(post_params)
    authorize post
    post.save!
    render_notice(t("successfully_created", entity: "Post"))
  end

  def show
    authorize @post
  end

  def destroy
    authorize @post
    @post.destroy
    render_notice(t("successfully_deleted", entity: "Post"))
  end

  def update
    authorize @post
    @post.update!(post_params)
    render_notice(t("successfully_updated", entity: "Post")) unless params.key?(:quiet)
  end

  def bulk_destroy
    @posts.each { |post| authorize post, :destroy? }
    posts_count = @posts.destroy_all.size
    render_notice(t("successfully_deleted", entity: posts_count > 1 ? "Posts" : "Post"))
  end

  def bulk_status_update
    @posts.each { |post| authorize post, :update? }
    posts_count = @posts.where.not(status: post_params[:status])
      .update_all(status: post_params[:status], updated_at: Time.current)
    render_notice(t("successfully_updated", entity: posts_count > 1 ? "Posts" : "Post"))
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :organization_id, :status, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def load_posts!
      if params[:scope] == "organization"
        @posts = current_user.organization.posts
      else
        @posts = current_user.posts
      end
      @posts = @posts.where(id: params[:post_ids]) if params[:post_ids].present?
    end
end
