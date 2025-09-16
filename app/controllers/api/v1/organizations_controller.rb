# frozen_string_literal: true

class Api::V1::OrganizationsController < ApplicationController
  def index
    organizations = Organization.all
    render_json(organizations)
  end
end
