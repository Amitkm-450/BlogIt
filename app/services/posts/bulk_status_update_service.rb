# frozen_string_literal: true

module Posts
  class BulkStatusUpdateService
    attr_reader :posts, :status

    def initialize(posts, status)
      @posts = posts
      @status = status
    end

    def process
      updates = build_updates
      update_records(updates)
    end

    private

      def build_updates
        base_updates = { status: }
        status == "published" ? base_updates.merge(last_published_at: Time.zone.now) : base_updates
      end

      def update_records(updates)
        posts.where.not(status: status).update_all(updates)
      end
  end
end
