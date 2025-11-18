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

  after_initialize :original_category_ids, if: :persisted?
  before_save :set_last_published_at, if: :should_update_last_published_at?

  def net_votes
    votes.sum(:value)
  end

  def categories_changed?
    return false if @_original_category_ids.nil?

    category_ids.sort != @_original_category_ids.sort
  end

  private

    def should_update_last_published_at?
      (errors.blank? && published?) || (republishable_changes_present? && published?)
    end

    def set_last_published_at
      self.last_published_at = Time.zone.now
    end

    def republishable_changes_present?
      attribute_changes = will_save_change_to_title? || will_save_change_to_description?
      attribute_changes || categories_changed?
    end

    def original_category_ids
      @_original_category_ids ||= category_ids.sort
    end
end
