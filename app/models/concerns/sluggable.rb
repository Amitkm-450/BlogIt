# frozen_string_literal: true

module Sluggable
  extend ActiveSupport::Concern

  included do
    before_create :set_slug
  end

  private

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_record_slug = self.class.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug

      slug_count = 0
      if latest_record_slug.present?
        slug_count = latest_record_slug.split("-").last.to_i
        only_one_slug_exists = slug_count.zero?
        slug_count = 1 if only_one_slug_exists
      end

      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end
end
