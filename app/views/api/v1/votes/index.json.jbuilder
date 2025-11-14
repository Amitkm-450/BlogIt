# frozen_string_literal: true

json.vote do
  json.id @vote&.id
  json.user_vote @vote&.value
end
