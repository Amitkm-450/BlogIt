# frozen_string_literal: true

class MyPostPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def bulk_destroy?
    records = Array(record)
    records.all? { |r| r.user_id == user.id }
  end

  def bulk_status_update?
    bulk_destroy?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(user_id: user.id)
    end
  end
end
