# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  def index
    categories = Category.all
    render_json(categories)
  end

  def create
    category = Category.new(category_param)
    category.save!
    render_notice("Category was successfully created")
  end

  private

    def category_param
      params.require(:category).permit(:name)
    end
end
