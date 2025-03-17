# frozen_string_literal: true

class AddStatusToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :status, :string, default: "draft", null: false
  end
end
