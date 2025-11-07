# frozen_string_literal: true

class Post < ApplicationRecord
  include Sluggable

  MAX_TITLE_LENGTH = 125
  MAX_DESCRIPTION_LENGTH = 10000

  enum status: {
    draft: "draft",
    published: "published"
  }

  belongs_to :user
  belongs_to :organization
  has_many :votes, dependent: :destroy

  has_and_belongs_to_many :categories
  has_one_attached :report

  validates :title, length: { maximum: MAX_TITLE_LENGTH }, presence: true
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, presence: true
  validates :is_bloggable, inclusion: { in: [true, false] }
  validates :slug, uniqueness: true
  validates_with SlugImmutableValidator

  def net_votes
    votes.sum(:value)
  end
end
