# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(post_id, report_path)
    puts "======================>>>>>>>>>>>>>><<<<<<<<<<<<<<========================="
    puts "Step 1"
    post = Post.find(post_id)
    content = ApplicationController.render(
      assigns: {
        post:
      },
      template: "api/v1/posts/report/download",
      layout: "pdf"
    )
    puts "Step 2"
    pdf_blob = WickedPdf.new.pdf_from_string content
    puts "Step 3"
    File.open(report_path, "wb") do |f|
      f.write(pdf_blob)
    end
  end
end
