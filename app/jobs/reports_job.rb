# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(post_id, report_path)
    post = Post.find(post_id)
    content = ApplicationController.render(
      assigns: {
        post:
      },
      template: "api/v1/posts/report/download",
      layout: "pdf"
    )
    pdf_blob = WickedPdf.new.pdf_from_string content
    File.open(report_path, "wb") do |f|
      f.write(pdf_blob)
    end
  end
end
