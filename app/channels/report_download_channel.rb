# frozen_string_literal: true

class ReportDownloadChannel < ApplicationCable::Channel
  def subscribed
    puts params[:pubsub_token]
    stream_from params[:pubsub_token] if params[:pubsub_token].present?
  end

  def unsubscribed
    stop_all_streams
  end
end
