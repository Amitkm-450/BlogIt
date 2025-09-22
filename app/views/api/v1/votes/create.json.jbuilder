# frozen_string_literal: true

json.vote do
  json.net_votes @post.net_votes
  json.user_vote @vote&.value || 0
end
