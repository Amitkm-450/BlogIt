# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  before_action :load_organization

  def index
    @categories = @current_organization.categories
  end

  def create
    @current_organization.categories.create!(category_params)
    render_notice(t("successfully_created", entity: t("entities.category")))
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end

    def load_organization
      @current_organization = current_user.organization
    end
end
