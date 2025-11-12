# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  include Pagy::Backend

  before_action :load_post_and_authorize!, only: %i[show destroy update]
  before_action :load_posts, only: %i[index bulk_destroy bulk_status_update]
  before_action :authorize_posts!, only: %i[bulk_destroy bulk_status_update]

  def index
    posts = @posts.includes(:user, :organization, :categories)
    posts = Posts::FilterService.new(posts, params).process
    @total_posts = posts.count
    @pagy, @posts = pagy(posts, items: 10, page: params[:page] || 1)
  end

  def create
    post = current_user.posts.create!(post_params)
    render_notice(t("successfully_created", entity: t("entities.post", count: 1)))
  end

  def show
    render
  end

  def destroy
    @post.destroy!
    render_notice(t("successfully_deleted", entity: t("entities.post", count: 1), count: 1))
  end

  def update
    @post.update!(post_params)
    render_notice(t("successfully_updated", entity: t("entities.post", count: 1), count: 1)) unless params.key?(:quiet)
  end

  def bulk_destroy
    posts_count = @posts.destroy_all.size
    render_notice(t("successfully_deleted", entity: t("entities.post", count: posts_count), count: posts_count))
  end

  def bulk_status_update
    posts_count = Posts::BulkStatusUpdateService.new(@posts, post_params[:status]).process

    render_notice(t("successfully_updated", entity: t("entities.post", count: posts_count), count: posts_count))
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :organization_id, :status, category_ids: [])
    end

    def load_post_and_authorize!
      @post = current_user.organization.posts.find_by!(slug: params[:slug])
      authorize @post
    end

    def load_posts
      if params[:scope] == "organization"
        @posts = current_user.organization.posts
      else
        @posts = current_user.posts
      end
      @posts = @posts.where(id: params[:post_ids]) if params[:post_ids].present?
    end

    def authorize_posts!
      authorize @posts
    end
end
