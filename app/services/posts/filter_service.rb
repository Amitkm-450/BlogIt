# frozen_string_literal: true

module Posts
  class FilterService
    def initialize(posts, params)
      @posts = posts
      @params = params
    end

    def process!
      filter_by_title
      filter_by_status
      filter_by_category
      @posts
    end

    private

      def filter_by_title
        return unless @params[:title].present?

        @posts = @posts.where("LOWER(title) LIKE ?", "%#{@params[:title].downcase}%")
      end

      def filter_by_status
        return unless @params[:status].present?

        @posts = @posts.where(status: @params[:status])
      end

      def filter_by_category
        return unless @params[:category_ids].present?

        @posts = @posts.joins(:categories).where(categories: { id: @params[:category_ids] }).distinct
      end
  end
end
