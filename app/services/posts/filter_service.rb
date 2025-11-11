# frozen_string_literal: true

module Posts
  class FilterService
    attr_accessor :posts, :params

    def initialize(posts, params)
      @posts = posts
      @params = params
    end

    def process
      filter_by_title
      filter_by_status
      filter_by_category
      self.posts = posts.order(created_at: :desc)
      posts
    end

    private

      def filter_by_title
        return unless params[:title].present?

        self.posts = posts.where("LOWER(title) LIKE ?", "%#{params[:title].downcase}%")
      end

      def filter_by_status
        return unless params[:status].present?

        self.posts = posts.where(status: params[:status])
      end

      def filter_by_category
        return unless params[:category_ids].present?

        self.posts = posts
          .joins(:categories)
          .where(categories: { id: params[:category_ids] })
          .distinct
      end
  end
end
