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

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(organization_id: user.organization_id).published
    end
  end
end
