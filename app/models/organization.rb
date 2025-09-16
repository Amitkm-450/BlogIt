# frozen_string_literal: true

class Organization < ApplicationRecord
  has_many :posts, dependent: :destroy

  validates :name, presence: true
end
