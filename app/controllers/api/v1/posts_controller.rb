# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: %i[show destroy update]
  before_action :load_posts!, only: %i[index bulk_destroy bulk_status_update]

  def index
    @posts = @posts.includes(:user, :organization, :categories)

    if params[:title].present?
      @posts = @posts.where("LOWER(title) LIKE ?", "%#{params[:title].downcase}%")
    end

    if params[:status].present?
      @posts = @posts.where(status: params[:status])
    end

    if params[:category_ids].present?
      @posts = @posts.joins(:categories).where(categories: { id: params[:category_ids] }).distinct
    end

    @posts
  end

  def create
    post = Post.new(post_params.merge({ user_id: current_user.id }))
    post.save!
    render_notice(t("successfully_created", entity: "Post"))
  end

  def show
    render
  end

  def destroy
    @post.destroy
    render_notice("Post was successfully deleted")
  end

  def update
    @post.update!(post_params)
    render_notice("Post was successfully updated") unless params.key?(:quiet)
  end

  def bulk_destroy
    @posts.destroy_all
    render_notice("Posts deleted successfully")
  end

  def bulk_status_update
    @posts.update_all(status: post_params[:status], updated_at: Time.current)
    render_notice("Posts updated successfully")
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
        @posts = Post.all
      else
        @posts = Post.where(user_id: current_user.id)
      end
      @posts = @posts.where(id: params[:post_ids]) if params[:post_ids].present?
    end
end
