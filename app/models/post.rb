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
  validates_with PreventRepublishingValidator

  before_save :set_last_published_at, if: :should_update_last_published_at?

  def net_votes
    votes.sum(:value)
  end

  private

    def should_update_last_published_at?
      (errors.blank? && published?) || (republishable_changes_present? && published?)
    end

    def republishable_changes_present?
      attribute_changes = will_save_change_to_title? || will_save_change_to_description?
      category_changes = categories.ids.sort != category_ids_before_change.sort
      attribute_changes || category_changes
    end

    def set_last_published_at
      self.last_published_at = Time.zone.now
    end

    def category_ids_before_change
      category_ids_in_db = Post.find(id).categories.ids
    rescue ActiveRecord::RecordNotFound
      []
    end
end
