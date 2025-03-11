# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create Organizations
org = Organization.create!(name: "Tech Organization")

# Create Users
user1 = User.create!(
  name: "John Doe",
  email: "john1@example.com",
  password_digest: BCrypt::Password.create("password"),
  organization: org
)

# Create Categories
category1 = Category.create!(name: "Tech", organization: org)
category2 = Category.create!(name: "Science", organization: org)
category3 = Category.create!(name: "Lifestyle", organization: org)

# Create Posts
post1 = Post.create!(
  title: "AI is the Future",
  description: "Artificial Intelligence is transforming the world.",
  user: user1,
  organization: org,
  slug: "ai-is-the-future"
)

post2 = Post.create!(
  title: "Climate Change",
  description: "Global warming is affecting the environment.",
  user: user1,
  organization: org,
  slug: "climate-change"
)

# Assign Categories to Posts (Many-to-Many Relationship)
post1.categories << category1
post1.categories << category2

post2.categories << category2
post2.categories << category3
