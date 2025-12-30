import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useNotification } from '../components/Notification';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const { showSuccess, showError, NotificationComponent } = useNotification();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setProfileData({
      fullName: currentUser.fullName,
      email: currentUser.email,
    });
    
    // Fetch fresh profile data from API
    userService.getProfile()
      .then(profileData => {
        setUser(profileData);
        setProfileData({
          fullName: profileData.fullName,
          email: profileData.email,
        });
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(profileData));
      })
      .catch(err => console.error('Failed to fetch profile:', err));
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setIsSaving(true);
    try {
      const response = await userService.updateProfile(profileData);
      // Update localStorage with the response data
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      setIsEditing(false);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError(error.response?.data?.message || error.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      fullName: user.fullName,
      email: user.email,
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    try {
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      showSuccess('Password changed successfully');
    } catch (error) {
      showError(error.response?.data?.message || error.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
    setErrors({});
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <NotificationComponent />
      
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>User Profile</h1>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
            >
              Back to Dashboard
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="profile-container">
          {/* Profile Information Section */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Profile Information</h2>
              {!isEditing && (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && (
                      <span className="error-message">{errors.fullName}</span>
                    )}
                  </>
                ) : (
                  <p className="profile-value">{user.fullName}</p>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </>
                ) : (
                  <p className="profile-value">{user.email}</p>
                )}
              </div>

              <div className="form-group">
                <label>Role</label>
                <p className="profile-value">
                  <span className={`role-badge role-${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="form-group">
                <label>Status</label>
                <p className="profile-value">
                  <span className={`status-badge status-${user.status}`}>
                    {user.status.toUpperCase()}
                  </span>
                </p>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Change Password</h2>
              {!isChangingPassword && (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={errors.currentPassword ? 'error' : ''}
                  />
                  {errors.currentPassword && (
                    <span className="error-message">{errors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={errors.newPassword ? 'error' : ''}
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelPassword}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleChangePassword}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
