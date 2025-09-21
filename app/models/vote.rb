# frozen_string_literal: true

class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :value, inclusion: { in: [1, -1] }
  validates :user_id, uniqueness: { scope: :post_id, message: "can vote only once per post" }
end
