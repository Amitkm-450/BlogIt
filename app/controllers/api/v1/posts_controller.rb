# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: %i[show destroy update]
  before_action :load_posts, only: %i[index bulk_destroy bulk_status_update]
  before_action :authorize_post!, only: %i[show destroy update]
  before_action :authorize_posts!, only: %i[bulk_destroy bulk_status_update]

  def index
    @posts = @posts.includes(:user, :organization, :categories)
    @posts = Posts::FilterService.new(@posts, params).process
  end

  def create
    post = current_user.posts.create!(post_params)
    render_notice(t("successfully_created", entity: "Post"))
  end

  def show
    render
  end

  def destroy
    @post.destroy
    render_notice(t("successfully_deleted", entity: "Post", count: 1))
  end

  def update
    @post.update!(post_params)
    render_notice(t("successfully_updated", entity: "Post", count: 1)) unless params[:quiet]
  end

  def bulk_destroy
    posts_count = @posts.destroy_all.size
    render_notice(t("successfully_deleted", entity: posts_count > 1 ? "Posts" : "Post", count: posts_count))
  end

  def bulk_status_update
    status = post_params[:status]
    updates = { status: }.merge(status == "published" ? { last_published_at: Time.zone.now } : {})

    posts_count = @posts.where.not(status: status)
      .update_all(updates)

    render_notice(t("successfully_updated", entity: posts_count > 1 ? "Posts" : "Post", count: posts_count))
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :organization_id, :status, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def load_posts
      if params[:scope] == "organization"
        @posts = current_user.organization.posts.published
      else
        @posts = current_user.posts
      end
      @posts = @posts.where(id: params[:post_ids]) if params[:post_ids].present?
    end

    def authorize_post!
      authorize @post
    end

    def authorize_posts!
      authorize @posts
    end
end
