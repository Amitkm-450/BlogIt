# frozen_string_literal: true

class Api::V1::Posts::ReportsController < ApplicationController
  before_action :load_post!

  def create
    ReportsJob.perform_async(@post.id, report_path.to_s)
    render_notice(t("in_progress", action: "Report generation"))
  end

  def download
    if File.exist?(report_path)
      send_file(
        report_path,
        type: "application/pdf",
        filename: pdf_file_name,
        disposition: "attachment"
      )
    else
      render_error(t("not_found", entity: "report"), :not_found)
    end
  end

  private

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def pdf_file_name
      "#{@post.slug}_report.pdf"
    end
end
