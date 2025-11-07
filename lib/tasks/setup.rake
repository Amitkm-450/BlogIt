# frozen_string_literal: true

desc "drops the db, creates db, migrates db and populates sample data"
task setup: [:environment, "db:drop", "db:create", "db:migrate"] do
  Rake::Task["reset_and_populate_sample_data"].invoke if Rails.env.development?
end

desc "Populates sample data without resetting the database first"
task populate_sample_data: [:environment] do
  create_sample_data!
  puts "sample data has been added."
end

desc "Populates sample data without after resetting the database"
task reset_and_populate_sample_data: [:environment] do
  if Rails.env.production?
    puts "Populating sample data in production (without delete)"
    Rake::Task["populate_sample_data"].invoke
  else
    delete_all_records_from_all_tables
    Rake::Task["populate_sample_data"].invoke
  end
end

#
# DO NOT CHANGE ANYTHING IN THIS METHOD
# This is last layer of defense against deleting data in production
# If you need to delete data in staging or in production
# please execute the command manually and do not change this method
#
def delete_all_records_from_all_tables
  if Rails.env.production?
    raise "deleting all records in production is not allowed"
  else
    Rake::Task["db:schema:load"].invoke
  end
end

def create_sample_data!
  puts "== Creating Organization =="
  organization = Organization.find_or_create_by!(name: "PixelCompute")

  puts "== Creating Users =="
  user1 = create_user!(
    name: "Oliver",
    email: "oliver@example.com",
    password: "welcome"
  )

  user2 = create_user!(
    name: "Alice",
    email: "alice@example.com",
    password: "welcome"
  )

  puts "== Creating Categories =="
  tech     = Category.find_or_create_by!(name: "Technology", organization_id: organization.id)
  design   = Category.find_or_create_by!(name: "Design", organization_id: organization.id)
  business = Category.find_or_create_by!(name: "Business", organization_id: organization.id)
  ai       = Category.find_or_create_by!(name: "Artificial Intelligence", organization_id: organization.id)

  puts "== Creating Posts =="
  post1 = Post.find_or_create_by!(
    title: "Understanding Microservices Architecture",
    user: user1,
    organization: organization
  ) do |post|
    post.description = "An introductory guide on microservices and how they improve scalability and team autonomy."
    post.status = "published"
    post.is_bloggable = true
  end

  post2 = Post.find_or_create_by!(
    title: "Top 5 UI Design Principles",
    user: user2,
    organization: organization
  ) do |post|
    post.description = "A concise guide on core UI design principles that help create intuitive user interfaces."
    post.status = "draft"
    post.is_bloggable = true
  end

  post3 = Post.find_or_create_by!(
    title: "AI and the Future of Work",
    user: user1,
    organization: organization
  ) do |post|
    post.description = "Exploring how Artificial Intelligence will reshape job markets, industries, and skills."
    post.status = "published"
    post.is_bloggable = true
  end

  puts "== Attaching Categories to Posts =="
  post1.categories = [tech, business]
  post2.categories = [design]
  post3.categories = [ai, business]

  puts "== Creating Votes =="
  Vote.find_or_create_by!(user: user1, post: post2, value: 1)
  Vote.find_or_create_by!(user: user2, post: post1, value: -1)
  Vote.find_or_create_by!(user: user1, post: post1, value: 1)
  Vote.find_or_create_by!(user: user2, post: post3, value: 1)


  puts "== Sample Data Creation Complete =="
end


def create_user!(options = {})
  user_attributes = {
    name: "Oliver Smith",
    email: "oliver@example.com",
    password: "welcome",
    password_confirmation: "welcome",
    organization_id: Organization.first.id
  }
  attributes = user_attributes.merge(options)
  User.create!(attributes)
end
