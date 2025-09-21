# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(post_id)
    post = Post.find(post_id)
    content = ApplicationController.render(
      assigns: {
        post:
      },
      template: "api/v1/posts/report/download",
      layout: "pdf"
    )
    pdf_blob = WickedPdf.new.pdf_from_string content
    if post.report.attached?
      post.report.purge_later
    end
    post.report.attach(
      io: StringIO.new(pdf_blob), filename: "#{post.slug}_report.pdf",
      content_type: "application/pdf")
    post.save
  end
end
