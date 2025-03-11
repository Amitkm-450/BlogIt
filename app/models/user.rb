# frozen_string_literal: true

class User < ApplicationRecord
  MIN_PASSWORD_LENGTH = 6
  MAX_EMAIL_LENGTH = 255
  VALID_EMAIL_REGEX = /\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i

  belongs_to :organization
  has_many :posts, dependent: :destroy

  has_secure_password
  has_secure_token :authentication_token

  validates :name, presence: true
  validates :email, presence: true,
    uniqueness: { case_sensitive: false },
    length: { maximum: MAX_EMAIL_LENGTH },
    format: { with: VALID_EMAIL_REGEX }
  validates :password, length: { minimum: MIN_PASSWORD_LENGTH }, if: -> { password.present? }
  validates :password_confirmation, presence: true, on: :create

  before_save :to_lowercase
  before_save :assign_random_organization, if: -> { organization_id.nil? }

  private

    def to_lowercase
      email.downcase!
    end

    # add random organization to user if null
    def assign_random_organization
      self.organization_id = 1
   end
end
