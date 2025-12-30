import pytest
from app import create_app, db
from app.models.user import User


@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Test client"""
    return app.test_client()


# ============================================================================
# AUTH TESTS
# ============================================================================

class TestSignup:
    def test_signup_success(self, client):
        """Test successful user signup"""
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        assert response.status_code == 201
        assert response.json['user']['email'] == 'john@example.com'
        assert response.json['user']['fullName'] == 'John Doe'
        assert response.json['token'] is not None

    def test_signup_invalid_email(self, client):
        """Test signup with invalid email format"""
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'invalid-email',
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        assert response.json['error']['code'] == 'validation_error'

    def test_signup_weak_password(self, client):
        """Test signup with weak password (less than 8 chars)"""
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'weak'
        })
        assert response.status_code == 400
        assert 'at least 8 characters' in response.json['error']['message']

    def test_signup_numeric_only_password(self, client):
        """Test signup with numeric-only password"""
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': '12345678'
        })
        assert response.status_code == 400
        assert 'letters and numbers' in response.json['error']['message']

    def test_signup_duplicate_email(self, client):
        """Test signup with duplicate email"""
        client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        
        response = client.post('/api/auth/signup', json={
            'fullName': 'Jane Doe',
            'email': 'john@example.com',
            'password': 'SecurePass456'
        })
        assert response.status_code == 400
        assert response.json['error']['code'] == 'auth_error'


class TestLogin:
    def test_login_success(self, client):
        """Test successful login"""
        client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        assert response.status_code == 200
        assert response.json['user']['email'] == 'john@example.com'
        assert response.json['token'] is not None

    def test_login_invalid_email(self, client):
        """Test login with non-existent email"""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        assert response.json['error']['code'] == 'auth_error'

    def test_login_wrong_password(self, client):
        """Test login with wrong password"""
        client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'WrongPassword'
        })
        assert response.status_code == 400
        assert 'Invalid credentials' in response.json['error']['message']


# ============================================================================
# PROTECTED ROUTES & AUTHENTICATION TESTS
# ============================================================================

class TestProtectedRoutes:
    def test_me_endpoint_requires_auth(self, client):
        """Test /me endpoint without token returns 401"""
        response = client.get('/api/auth/me')
        assert response.status_code == 401

    def test_logout_requires_auth(self, client):
        """Test logout without token returns 401"""
        response = client.post('/api/auth/logout')
        assert response.status_code == 401

    def test_profile_requires_auth(self, client):
        """Test profile endpoint without token returns 401"""
        response = client.get('/api/profile')
        assert response.status_code == 401

    def test_invalid_token_rejected(self, client):
        """Test that invalid token is rejected"""
        response = client.get(
            '/api/profile',
            headers={'Authorization': 'Bearer invalid_token_here'}
        )
        # Invalid token returns 422 Unprocessable Entity
        assert response.status_code in [401, 422]


# ============================================================================
# RBAC TESTS (Role-Based Access Control)
# ============================================================================

class TestRoleBasedAccessControl:
    """RBAC is implemented in @role_required decorator"""
    def test_auth_decorator_protects_endpoints(self, client):
        """Test that authentication is required for protected endpoints"""
        # /api/users requires @jwt_required() and @role_required("admin")
        response = client.get('/api/users')
        # Should fail with 401 because no token provided
        assert response.status_code == 401


# ============================================================================
# INPUT VALIDATION TESTS
# ============================================================================

class TestInputValidation:
    def test_signup_missing_fullname(self, client):
        """Test signup with missing fullName"""
        response = client.post('/api/auth/signup', json={
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        assert 'Missing fields' in response.json['error']['message']

    def test_signup_missing_email(self, client):
        """Test signup with missing email"""
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        assert 'Missing fields' in response.json['error']['message']

    def test_signup_missing_password(self, client):
        """Test signup with missing password"""
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com'
        })
        assert response.status_code == 400
        assert 'Missing fields' in response.json['error']['message']

    def test_login_missing_email(self, client):
        """Test login with missing email"""
        response = client.post('/api/auth/login', json={
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        assert 'Missing fields' in response.json['error']['message']

    def test_update_profile_missing_fields(self, client):
        """Test profile update with missing required fields"""
        # Create and login user
        client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        
        login_response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        token = login_response.json['token']
        
        # Try to update with missing fields
        response = client.put(
            '/api/profile',
            json={'fullName': 'Updated Name'},
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 400


# ============================================================================
# SECURITY FEATURES TESTS
# ============================================================================

class TestSecurityFeatures:
    def test_password_is_hashed_not_plaintext(self, app, client):
        """Test that passwords are hashed and never stored in plain text"""
        client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        
        # Verify password is hashed in database
        with app.app_context():
            user = User.query.filter_by(email='john@example.com').first()
            assert user is not None
            assert user.password_hash != 'SecurePass123'
            # bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$
            assert user.password_hash.startswith('$2')

    def test_inactive_user_cannot_login(self, app, client):
        """Test that deactivated users cannot login"""
        # Create user
        client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        
        # Deactivate user in database
        with app.app_context():
            user = User.query.filter_by(email='john@example.com').first()
            user.status = 'inactive'
            db.session.commit()
        
        # Try to login as inactive user
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        assert 'inactive' in response.json['error']['message'].lower()

    def test_correct_http_status_codes(self, client):
        """Test that endpoints return correct HTTP status codes"""
        # 201 Created for successful signup
        response = client.post('/api/auth/signup', json={
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePass123'
        })
        assert response.status_code == 201
        
        # 400 Bad Request for invalid input
        response = client.post('/api/auth/signup', json={
            'fullName': 'Jane Doe',
            'email': 'invalid-email',
            'password': 'SecurePass123'
        })
        assert response.status_code == 400
        
        # 401 Unauthorized for missing token
        response = client.get('/api/profile')
        assert response.status_code == 401
        
        # 404 Not Found for non-existent route
        response = client.get('/api/nonexistent')
        assert response.status_code == 404
