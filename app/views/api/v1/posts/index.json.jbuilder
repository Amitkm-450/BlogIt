# frozen_string_literal: true

json.array! @posts, partial: "api/v1/posts/post", as: :post
