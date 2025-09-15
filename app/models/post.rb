# frozen_string_literal: true

class Post < ApplicationRecord
  MAX_TITLE_LENGTH = 125
  MAX_DESCRIPTION_LENGTH = 10000

  validates :title, length: { maximum: MAX_TITLE_LENGTH }, presence: true
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, presence: true
  validates :is_bloggable, inclusion: { in: [true, false] }
  validates :slug, uniqueness: true
end
