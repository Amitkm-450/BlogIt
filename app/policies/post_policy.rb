# frozen_string_literal: true

# app/policies/post_policy.rb
class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  def show?
    post.user_id == user.id || post.organization_id == 1
  end

  def create?
    user.present?
  end

  def update?
    post.user_id == user.id
  end

  def destroy?
    post.user_id == user.id
  end
end
