# frozen_string_literal: true

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
    update?
  end

  def bulk_destroy?
    records = Array(record)
    records.all? { |record| record.user_id == user.id }
  end

  def bulk_status_update?
    bulk_destroy?
  end
end
