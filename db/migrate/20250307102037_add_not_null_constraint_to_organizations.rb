# frozen_string_literal: true

class AddNotNullConstraintToOrganizations < ActiveRecord::Migration[7.1]
  def change
    change_column_null :organizations, :name, false
  end
end
