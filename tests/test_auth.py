import os
import sys

import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, db


@pytest.fixture
def client():
    app.config.update(TESTING=True)
    with app.test_client() as client:
        with app.app_context():
            db.init_db()
            yield client


def test_login_page(client):
    response = client.get('/login')
    assert response.status_code == 200


def test_register_and_login_flow(client):
    register_response = client.post('/register', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'secret123',
        'confirm_password': 'secret123'
    }, follow_redirects=True)
    assert register_response.status_code == 200

    login_response = client.post('/login', data={
        'email': 'test@example.com',
        'password': 'secret123'
    }, follow_redirects=True)
    assert login_response.status_code == 200
