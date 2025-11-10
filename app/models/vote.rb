# frozen_string_literal: true

class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :value, inclusion: { in: [1, -1] }
  validates :user_id, uniqueness: { scope: :post_id, message: I18n.t("one_vote_per_post") }
end
