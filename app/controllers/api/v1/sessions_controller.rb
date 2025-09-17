# frozen_string_literal: true

class Api::V1::SessionsController < ApplicationController
  def create
    @user = User.find_by!(email: login_params[:email].downcase)
    unless @user.authenticate(login_params[:password])
      render_error("Incorrect credentials, try again.", :unauthorized)
    end
  end

  private

    def login_params
      params.require(:login).permit(:email, :password)
    end
end
