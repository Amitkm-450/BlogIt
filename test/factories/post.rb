# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    association :user
    association :organization
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    is_bloggable { true }
    slug { Faker::Internet.slug }
  end
end
