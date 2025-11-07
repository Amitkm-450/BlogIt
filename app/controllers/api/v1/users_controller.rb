# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :create
  before_action :load_organization

  def create
    @current_organization.users.create!(user_params)
    render_notice(t("successfully_created", entity: "User"))
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

    def load_organization
      @current_organization = Organization.first
    end
end
