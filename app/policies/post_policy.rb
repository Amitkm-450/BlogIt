# frozen_string_literal: true

# app/policies/post_policy.rb
class PostPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def show?
    record.organization_id == user.organization_id
  end

  def update?
    record.user_id == user.id
  end

  def destroy?
    record.user_id == user.id
  end

  def bulk_destroy?
    records = Array(record)
    records.all? { |r| r.user_id == user.id }
  end

  def bulk_status_update?
    records = Array(record)
    records.all? { |r| r.user_id == user.id }
  end
end
