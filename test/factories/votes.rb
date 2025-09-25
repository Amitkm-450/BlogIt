# frozen_string_literal: true

FactoryBot.define do
  factory :vote do
    association :user
    association :post
    value { [1, -1].sample }
  end
end
