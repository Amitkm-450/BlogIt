# frozen_string_literal: true

Rails.application.routes.draw do
  resources :posts, only: %i[index create show], param: :slug

  root "home#index"
  get "*path", to: "home#index", via: :all
end
