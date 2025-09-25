# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_valid_category
    assert @category.valid?
  end

  def test_name_must_be_present
    @category.name = nil
    assert @category.invalid?
    assert_includes @category.errors.messages[:name], I18n.t("errors.messages.blank")
  end
end
