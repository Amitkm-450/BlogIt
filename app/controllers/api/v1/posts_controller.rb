# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: %i[show destroy]

  def index
    @posts = Post.includes(:user, :organization, :categories).all
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

  private

    def post_params
      params.require(:post).permit(:title, :description, :organization_id, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
