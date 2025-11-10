# frozen_string_literal: true

require "test_helper"

class Posts::FilterServiceTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)

    @category1 = create(:category, name: "Tech", organization: @organization)
    @category2 = create(:category, name: "Design", organization: @organization)

    @post1 = create(
      :post, title: "Ruby on Rails", status: "draft", user: @user, organization: @organization,
      categories: [@category1])
    @post2 = create(
      :post, title: "React Guide", status: "published", user: @user, organization: @organization,
      categories: [@category2])
    @post3 = create(
      :post, title: "Rails Testing", status: "published", user: @user, organization: @organization,
      categories: [@category1])
  end

  def test_returns_all_posts_without_filters
    result = Posts::FilterService.new(Post.all, {}).process
    assert_equal 3, result.size
  end

  def test_filters_by_title
    result = Posts::FilterService.new(Post.all, { title: "rails" }).process
    assert_equal [@post1, @post3].sort, result.sort
  end

  def test_filters_by_status
    result = Posts::FilterService.new(Post.all, { status: "published" }).process
    assert_equal [@post2, @post3].sort, result.sort
  end

  def test_filters_by_category
    result = Posts::FilterService.new(Post.all, { category_ids: [@category1.id] }).process
    assert_equal [@post1, @post3].sort, result.sort
  end

  def test_filters_by_combination
    params = { title: "rails", status: "published", category_ids: [@category1.id] }
    result = Posts::FilterService.new(Post.all, params).process
    assert_equal [@post3], result
  end
end
