# frozen_string_literal: true

class Api::V1::Posts::ReportsController < ApplicationController
  before_action :load_post!

  def create
    ReportsJob.perform_async(@post.id, @current_user.id)
  end

  def download
    if @post.report.attached?
      send_data @post.report.download, filename: pdf_file_name, content_type: "application/pdf"
    else
      render_error(t("not_found", entity: t("entities.report")), :not_found) and return
    end
  end

  private

    def load_post!
      @post = current_user.organization.posts.find_by!(slug: params[:slug])
    end

    def pdf_file_name
      "#{@post.slug}_report.pdf"
    end
end
