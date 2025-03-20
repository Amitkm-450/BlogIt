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

def create_sample_organizations!
  puts "Seeding with sample organizations..."
  create_organization!(name: "Tech Corp")
  create_organization!(name: "Startup Inc")
  create_organization!(name: "OpenAI")
  puts "Done! Organizations have been created."
end

def create_organization!(options = {})
  Organization.find_or_create_by!(options)
end

# Run the organization seeding
create_sample_organizations!

puts "Database successfully seeded!"
