# frozen_string_literal: true

class MakeOrganizationNameNotNull < ActiveRecord::Migration[7.1]
  def change
    change_column_null :organizations, :name, false
  end
end
