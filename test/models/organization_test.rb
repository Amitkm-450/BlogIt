# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_valid_organization
    assert @organization.valid?
  end

  def test_name_must_be_present
    @organization.name = nil
    assert @organization.invalid?
    assert_includes @organization.errors.messages[:name], I18n.t("errors.messages.blank")
  end

  def test_dependent_posts_are_destroyed
    organization = create(:organization)
    post = create(:post, organization: organization)
    assert_difference "Post.count", -1 do
      organization.destroy
    end
  end
end
