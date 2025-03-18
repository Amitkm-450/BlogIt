 # frozen_string_literal: true

 class PostFilterService
   attr_reader :params, :current_user, :posts

   def initialize(posts, params, current_user)
     @posts = posts
     @params = params
     @current_user = current_user
   end

   def process!
     filter_posts
   end

   private

     def filter_posts
       @posts =
   if params[:self].present?
     @posts.where(user_id: current_user.id)
   else
     @posts.joins(:user)
       .where(users: { organization_id: current_user.organization_id })
   end

       @posts = @posts.joins(:categories)
         .where(categories: { id: params[:category_ids] })
         .distinct if params[:category_ids].present?
       @posts = posts.where(status: params[:status]) if params[:status].present?
       @posts = posts.where("LOWER(title) LIKE ?", "%#{params[:title].downcase}%") if params[:title].present?
       @posts
     end
 end
