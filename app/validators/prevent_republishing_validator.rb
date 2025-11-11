# frozen_string_literal: true

class PreventRepublishingValidator < ActiveModel::Validator
  def validate(record)
    return unless republishing_without_changes?(record)

    record.errors.add(:base, I18n.t("cannot_republish_without_changes"))
  end

  private

    def republishing_without_changes?(record)
      record.persisted? &&
        record.status == "published" &&
        previously_published?(record) &&
        !changes_except_status?(record)
    end

    def previously_published?(record)
      record.status_before_last_save == "published" || record.status_was == "published"
    end

    def changes_except_status?(record)
      ignored_fields = ["status", "updated_at"]
      (record.changed - ignored_fields).any?
    end
end
