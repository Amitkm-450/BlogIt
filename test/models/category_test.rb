# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @organization = Organization.create!(name: "Test Org")
    @category = Category.new(name: "Tech", organization: @organization)
  end

  def test_category_should_be_valid_with_valid_attributes
    assert @category.valid?
  end

  def test_category_should_not_be_valid_without_name
    @category.name = ""
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name can't be blank"
  end

  def test_category_should_not_be_valid_without_organization
    @category.organization = nil
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Organization must exist"
  end
end
