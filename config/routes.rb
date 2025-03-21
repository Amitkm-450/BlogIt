# frozen_string_literal: true

Rails.application.routes.draw do
  get "posts/my-blogs", to: "home#index"

  resources :posts, only: %i[index create show update destroy], param: :slug do
    collection do
      delete :bulk_delete
      patch :bulk_update_status
    end

    resource :report, only: [:create], module: :posts do
      get :download
    end

    resource :vote, only: [:create]
  end

  resources :categories, only: [:index, :create]
  resources :organizations, only: :index
  resources :users, only: [:create, :show]
  resource :session, only: [:create, :destroy]

  root "home#index"
  get "*path", to: "home#index", via: :all
end
