import unittest.mock as mock
import pytest
from auth import Auth0

def test_generate_headers():
    headers = Auth0.generate_headers()
    assert headers["Content-Type"] == "application/json"
    assert "Bearer" in headers["Authorization"]

@mock.patch("auth.requests.get")
def test_get_user_by_email(mock_requests_get):
    user_info_list = [{"email": "example@example.com"}]
    mock_requests_get.return_value.status_code = 200
    mock_requests_get.return_value.json.return_value = user_info_list
    user_info = Auth0.get_user_by_email("example@example.com")
    assert user_info == user_info_list[0]

@mock.patch("auth.requests.post")
def test_exchange_code_for_token(mock_requests_post):
    code = "authorization_code"
    access_token = "access_token"
    with mock.patch("auth.requests.post") as mock_requests_post:
        mock_requests_post.return_value.status_code = 200
        mock_requests_post.return_value.json.return_value = {"access_token": access_token}

        result = Auth0.exchange_code_for_token(code)

    assert result == access_token


def test_get_user_by_id():
    user_id = "user_id"
    user_info = {"email": "example@example.com"}
    with mock.patch("auth.requests.get") as mock_requests_get:
        mock_requests_get.return_value.status_code = 200
        mock_requests_get.return_value.json.return_value = user_info

        result = Auth0.get_user_by_id(user_id)

    assert result == user_info
