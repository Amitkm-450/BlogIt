json.post do
  json.extract! @post,
    :id,
    :slug,
    :title,
    :description,
    :created_at

  json.user do
    json.extract! @post.user,
      :id,
      :name
  end

  json.categories do
    json.array! @post.categories, :id, :name
  end
end
