# frozen_string_literal: true

require "test_helper"

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @user.regenerate_authentication_token
    @headers = headers(@user)
  end

  def test_should_list_all_organizations
    create_list(:organization, 2)
    get api_v1_organizations_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal Organization.count, response_json.length
  end
end
