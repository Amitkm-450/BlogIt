# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MIN_PASSWORD_LENGTH = 6
  VALID_EMAIL_REGEX = /\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  MAX_EMAIL_LENGTH = 255

  has_many :posts, dependent: :destroy
  has_secure_password
  has_secure_token :authentication_token

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :password, length: { minimum: MIN_PASSWORD_LENGTH }, if: -> { password.present? }
  validates :password_confirmation, presence: true, on: :create
  validates :email, presence: true,
    uniqueness: { case_sensitive: false },
    length: { maximum: MAX_EMAIL_LENGTH },
    format: { with: VALID_EMAIL_REGEX }

  before_save :to_lowercase

  private

    def to_lowercase
      email.downcase!
    end
end
