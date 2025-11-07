# frozen_string_literal: true

class SlugImmutableValidator < ActiveModel::Validator
  def validate(record)
    if record.persisted? && record.will_save_change_to_slug?
      record.errors.add(:slug, I18n.t("post.slug.immutable"))
    end
  end
end
