# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    association :organization
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { "password" }
    password_confirmation { "password" }
  end
end
