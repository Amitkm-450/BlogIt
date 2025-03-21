# frozen_string_literal: true

class PdfGeneratorJob
  include Sidekiq::Job

  def perform
    puts "PdfGenerator is performed"
  end

  # def perform(user_id)
  #   user = User.find(user_id)
  #   posts = Task.where(user_id: user_id)

  #   pdf_html = ApplicationController.render(
  #     assigns: { posts: posts },
  #     template: "tasks/report", # Adjust path as per your app
  #     layout: "pdf"
  #   )

  #   pdf_report = WickedPdf.new.pdf_from_string(pdf_html)

  #   # Attach PDF to user (ActiveStorage)
  #   user.report.purge_later if user.report.attached?

  #   user.report.attach(
  #     io: StringIO.new(pdf_report),
  #     filename: "report_#{Time.current.to_i}.pdf",
  #     content_type: "application/pdf"
  #   )
  # end
end
