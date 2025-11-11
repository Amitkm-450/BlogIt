# frozen_string_literal: true

json.posts @posts, partial: "api/v1/posts/post", as: :post
json.count @total_posts
