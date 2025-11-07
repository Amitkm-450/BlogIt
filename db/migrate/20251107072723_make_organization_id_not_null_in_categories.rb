# frozen_string_literal: true

class MakeOrganizationIdNotNullInCategories < ActiveRecord::Migration[7.1]
  def change
    change_column_null :categories, :organization_id, false
  end
end
