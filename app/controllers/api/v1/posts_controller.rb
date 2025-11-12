# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  include Pagy::Backend

  before_action :load_post_and_authorize!, only: %i[show destroy update]

  def index
    posts = policy_scope(Post).includes(:user, :organization, :categories)
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

  private

    def load_post_and_authorize!
      @post = current_user.organization.posts.find_by!(slug: params[:slug])
      authorize @post
    end

    def post_params
      params.require(:post).permit(:title, :description, :organization_id, :status, category_ids: [])
    end
end
