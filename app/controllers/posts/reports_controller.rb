# frozen_string_literal: true

class Posts::ReportsController < ApplicationController
  def create
    ReportsJob.perform_async(current_user.id, params[:post_slug])
  end

  def download
    @post = Post.find_by(slug: params[:post_slug])
    unless @post.report.attached?
      render_error(t("not_found", entity: "report"), :not_found) and return
    end

    send_data @post.report.download, filename: pdf_file_name, content_type: "application/pdf"
  end

  private

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def pdf_file_name
      "#{params[:post_slug]}.pdf"
    end
end
