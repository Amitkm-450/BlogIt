web: bundle exec rails server -b 0.0.0.0 -p $PORT
worker: bundle exec sidekiq
release: bundle exec rake db:migrate db:seed
