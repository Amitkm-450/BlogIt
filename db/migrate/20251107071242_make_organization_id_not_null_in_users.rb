# frozen_string_literal: true

class MakeOrganizationIdNotNullInUsers < ActiveRecord::Migration[7.1]
  def change
    change_column_null :users, :organization_id, false
  end
end
