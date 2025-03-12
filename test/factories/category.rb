# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    association :organization
    name { Faker::IndustrySegments.sector }
  end
end
