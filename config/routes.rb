# frozen_string_literal: true

Rails.application.routes.draw do
  resources :posts, only: %i[index create show], param: :slug
  resources :categories, only: [:index, :create]
  resources :organizations, only: :index
  resources :users, only: :create

  root "home#index"
  get "*path", to: "home#index", via: :all
end
