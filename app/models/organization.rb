# frozen_string_literal: true

class Organization < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :categories
  has_many :posts

  validates :name, presence: true
end
