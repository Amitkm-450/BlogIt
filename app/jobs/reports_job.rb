# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(user_id, post_slug)
    puts "#{user_id} laksl"
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.render"), progress: 25 })
    post = Post.find_by(slug: post_slug)
    content = ApplicationController.render(
      assigns: {
        post: post
      },
      template: "posts/report/download",
      layout: "pdf"
    )

    ActionCable.server.broadcast(user_id, { message: I18n.t("report.generate"), progress: 50 })
    pdf_blob = WickedPdf.new.pdf_from_string content
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.upload"), progress: 75 })
    if post.report.attached?
      post.report.purge_later
    end
    post.report.attach(
      io: StringIO.new(pdf_blob), filename: "#{post_slug}.pdf",
      content_type: "application/pdf")
    post.save
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.attach"), progress: 100 })
  end
end
