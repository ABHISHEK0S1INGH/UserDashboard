import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role === 'admin') {
      navigate('/admin');
    } else {
      setUser(currentUser);
      // Fetch fresh user data from API
      authService.getUserInfo()
        .then(userData => setUser(userData))
        .catch(err => console.error('Failed to fetch user info:', err));
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>User Information</h2>
          <div className="user-info-grid">
            <div className="user-info-item">
              <span className="user-info-label">Full Name:</span>
              <span className="user-info-value">{user.fullName}</span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Email:</span>
              <span className="user-info-value">{user.email}</span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">User ID:</span>
              <span className="user-info-value">{user.id}</span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Role:</span>
              <span className="user-info-value">
                {user.role?.toUpperCase()}
              </span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Status:</span>
              <span className="user-info-value">
                {user.status?.toUpperCase()}
              </span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Account Created:</span>
              <span className="user-info-value">
                {formatDate(user.createdAt)}
              </span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Last Login:</span>
              <span className="user-info-value">
                {formatDate(user.lastLoginAt)}
              </span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Last Updated:</span>
              <span className="user-info-value">
                {formatDate(user.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
