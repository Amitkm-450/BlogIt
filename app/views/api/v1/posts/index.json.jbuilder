json.array! @posts do |post|
  # Extract main post attributes
  json.extract! post, :id, :title, :description, :slug, :upvotes, :downvotes, :is_bloggable, :created_at, :updated_at

  # User
  json.user do
    json.extract! post.user, :id, :name
  end

  # Organization
  json.organization do
    json.extract! post.organization, :id, :name
  end

  # Categories (as an array of objects with id and name)
  json.categories post.categories do |category|
    json.extract! category, :id, :name
  end
end
