# frozen_string_literal: true

class CategoriesController < ApplicationController
  def index
    categories = Category.select(:id, :name)
    render status: :ok, json: { categories: categories.as_json }
  end

  def create
    organization = Organization.find_by(name: category_params[:organization_name])
    category = organization.categories.build(name: category_params[:name])
    category.save!
    render_notice(t("successfully_created", entity: "Category"))
  end

  private

    def category_params
      params.require(:category).permit(:name, :organization_name)
    end
end
