# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(post_id, user_id)
    post = Post.find(post_id)
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.render"), progress: 25 })
    content = ApplicationController.render(
      assigns: {
        post:
      },
      template: "api/v1/posts/report/download",
      layout: "pdf"
    )
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.generate"), progress: 50 })
    pdf_blob = WickedPdf.new.pdf_from_string content
    if post.report.attached?
      post.report.purge_later
    end
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.upload"), progress: 75 })
    post.report.attach(
      io: StringIO.new(pdf_blob), filename: "#{post.slug}_report.pdf",
      content_type: "application/pdf")
    post.save
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.attach"), progress: 100 })
  end
end
