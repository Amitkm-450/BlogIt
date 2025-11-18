# frozen_string_literal: true

json.extract! post,
  :id,
  :title,
  :description,
  :slug,
  :is_bloggable,
  :updated_at,
  :created_at,
  :status,
  :last_published_at
json.net_votes post.net_votes

json.user do
  json.extract! post.user, :id, :name
end

json.organization do
  json.extract! post.organization, :id, :name
end

json.categories post.categories, partial: "api/v1/categories/category", as: :category
