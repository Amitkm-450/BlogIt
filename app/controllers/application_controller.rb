# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include ApiResponders
  include ApiExceptions
  include Authenticable

  private

    def current_user
      @current_user
    end
end
