# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :organization
  has_and_belongs_to_many :posts
end
