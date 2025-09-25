# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    association :user
    association :organization

    title { Faker::Book.title }
    description { Faker::Lorem.paragraph(sentence_count: 3) }
    is_bloggable { [true, false].sample }
    status { "draft" }
  end
end
