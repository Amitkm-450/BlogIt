# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token

  def index
    respond_to do |format|
      format.html
      format.json { render json: { status: "ok" } }
    end
  end
end
