# frozen_string_literal: true

class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :value, inclusion: { in: [1, -1] }
  validates :user_id, uniqueness: { scope: :post_id, message: I18n.t("one_vote_per_post") }

  after_save :update_post_votes_and_bloggable_status
  after_destroy :update_post_votes_and_bloggable_status

  private

    def update_post_votes_and_bloggable_status
      upvotes = post.votes.where(value: 1).count
      downvotes = post.votes.where(value: -1).count

      net_votes = post.net_votes
      is_bloggable = net_votes > Constants::BLOG_THRESHOLD

      post.update!(
        upvotes:,
        downvotes:,
        is_bloggable:
      )
    end
end
