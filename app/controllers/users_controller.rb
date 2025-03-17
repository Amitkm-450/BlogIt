# frozen_string_literal: true

class UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :create

  def create
    user = User.new(user_params)
    # dummy org_id
    user.organization_id = 1
    user.save!
    render_notice(t("successfully_created", entity: "User"))
  end

  def show
    user = @current_user
    render status: :ok, json: { user: user }
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
