# frozen_string_literal: true

class Post < ApplicationRecord
  scope :accessible_to, ->(user_id) { where("task_owner_id = ? OR assigned_user_id = ?", user_id, user_id) }
  MAX_TITLE_LENGTH = 125
  MAX_DESCRIPTION_LENGTH = 10000

  enum :status, { draft: "draft", published: "published" }, default: :draft

  belongs_to :user
  belongs_to :organization
  has_many :votes, dependent: :destroy
  has_and_belongs_to_many :categories, join_table: "categories_posts"
  has_one_attached :report

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAX_DESCRIPTION_LENGTH }
  validates_inclusion_of :is_bloggable, in: [true, false]
  validates :slug, uniqueness: true
  validate :slug_not_changed

  before_create :set_slug
  after_save :toggle_bloggable_status, if: :votes_changed?

  def author_name
    user.name
  end

  private

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_task_slug = Post.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_task_slug.present?
        slug_count = latest_task_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
end

    def slug_not_changed
      if will_save_change_to_slug? && self.persisted?
        errors.add(:slug, I18n.t("task.slug.immutable"))
      end
    end

    def toggle_bloggable_status
      update_column(:is_bloggable, dynamic_net_votes >= VOTE_THRESHOLD)
   end

    def dynamic_net_votes
      votes.where(vote_type: "upvote").count - votes.where(vote_type: "downvote").count
    end

    def net_votes
      upvotes - downvotes
    end

    def votes_changed?
      votes.exists?
    end
end
