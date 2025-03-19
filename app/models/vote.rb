# frozen_string_literal: true

class Vote < ApplicationRecord
  belongs_to :post
  belongs_to :user

  validates :user_id, uniqueness: { scope: :post_id, message: "can only vote once per post" }
  validates :vote_type, inclusion: { in: ["upvote", "downvote"], message: "must be 'upvote' or 'downvote'" }
end
