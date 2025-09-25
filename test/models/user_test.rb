# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @user = build(:user)
  end

  def test_valid_user
    assert @user.valid?
  end

  def test_name_must_be_present_and_within_limit
    @user.name = nil
    assert @user.invalid?
    assert_includes @user.errors.messages[:name], I18n.t("errors.messages.blank")

    @user.name = "a" * (User::MAX_NAME_LENGTH + 1)
    assert @user.invalid?
  end

  def test_email_must_be_present_unique_and_valid
    @user.email = nil
    assert @user.invalid?
    assert_includes @user.errors.messages[:email], I18n.t("errors.messages.blank")

    create(:user, email: "test@example.com")
    @user.email = "test@example.com"
    assert @user.invalid?

    @user.email = "invalid_email"
    assert @user.invalid?
  end

  def test_password_must_have_min_length
    @user.password = "123"
    @user.password_confirmation = "123"
    assert @user.invalid?
  end

  def test_password_confirmation_is_required_on_create
    user = build(:user, password_confirmation: nil)
    assert user.invalid?
  end

  def test_email_is_downcased_before_save
    user = create(:user, email: "TEST@EXAMPLE.COM")
    assert_equal "test@example.com", user.email
  end
end
