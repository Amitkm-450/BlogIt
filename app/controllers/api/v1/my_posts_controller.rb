# frozen_string_literal: true

class Api::V1::MyPostsController < ApplicationController
  include Pagy::Backend

  before_action :load_user_posts_and_authorize!, only: %i[bulk_destroy bulk_status_update]

  def index
    posts = policy_scope(Post, policy_scope_class: MyPostPolicy::Scope).includes(:user, :organization, :categories)
    posts = Posts::FilterService.new(posts, params).process
    @total_posts = posts.count
    @pagy, @posts = pagy(posts, items: 10, page: params[:page] || 1)
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

    def load_user_posts_and_authorize!
      @posts = current_user.posts
      @posts = @posts.where(id: params[:post_ids]) if params[:post_ids].present?
      authorize @posts, policy_class: MyPostPolicy
    end

    def post_params
      params.require(:post).permit(:status)
    end
end
