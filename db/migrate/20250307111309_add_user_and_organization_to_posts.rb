# frozen_string_literal: true

class AddUserAndOrganizationToPosts < ActiveRecord::Migration[7.1]
  def change
    add_reference :posts, :user, foreign_key: true
    add_reference :posts, :organization, foreign_key: true

    # Optional: Set default user/organization IDs for existing posts to avoid NOT NULL constraint errors
    reversible do |dir|
      dir.up do
        default_user = User.first # Or create a dummy user
        default_org = Organization.first # Or create a dummy organization

        Post.update_all(user_id: default_user.id, organization_id: default_org.id) if default_user && default_org
      end
    end

    # Now set NOT NULL constraint
    change_column_null :posts, :user_id, false
    change_column_null :posts, :organization_id, false
  end
end
