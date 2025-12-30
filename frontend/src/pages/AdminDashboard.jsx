import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useNotification } from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
    user: null,
  });
  
  const { showSuccess, showError, NotificationComponent } = useNotification();
  const usersPerPage = 10;

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers(currentPage);
  }, [currentPage, navigate]);

  const fetchUsers = async (page) => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsers(page, usersPerPage);
      // Response structure: { items: [], page: 1, pages: 1, total: 6, limit: 10 }
      setUsers(response.items || []);
      setTotalUsers(response.total || 0);
      setTotalPages(response.pages || 1);
    } catch (error) {
      showError(error.response?.data?.message || error.response?.data?.error?.message || 'Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const openConfirmDialog = (action, user) => {
    setConfirmDialog({
      isOpen: true,
      action,
      user,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      action: null,
      user: null,
    });
  };

  const handleActivateUser = async () => {
    if (!confirmDialog.user) return;
    
    try {
      const result = await userService.activateUser(confirmDialog.user.id);
      showSuccess(`User ${result.email || confirmDialog.user.email} has been activated`);
      closeConfirmDialog();
      fetchUsers(currentPage);
    } catch (error) {
      showError(error.response?.data?.message || error.response?.data?.error?.message || 'Failed to activate user');
    }
  };

  const handleDeactivateUser = async () => {
    if (!confirmDialog.user) return;
    
    try {
      const result = await userService.deactivateUser(confirmDialog.user.id);
      showSuccess(`User ${result.email || confirmDialog.user.email} has been deactivated`);
      closeConfirmDialog();
      fetchUsers(currentPage);
    } catch (error) {
      showError(error.response?.data?.message || error.response?.data?.error?.message || 'Failed to deactivate user');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-container">
      <NotificationComponent />
      
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Admin Dashboard</h1>
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
        <div className="admin-panel">
          <div className="panel-header">
            <h2>User Management</h2>
            <p className="user-count">Total Users: {totalUsers}</p>
          </div>

          {isLoading ? (
            <LoadingSpinner size="large" message="Loading users..." />
          ) : (
            <>
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Full Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.fullName}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            {user.status === 'active' ? (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => openConfirmDialog('deactivate', user)}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => openConfirmDialog('activate', user)}
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={
          confirmDialog.action === 'activate'
            ? handleActivateUser
            : handleDeactivateUser
        }
        title={`${confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'} User`}
        message={`Are you sure you want to ${confirmDialog.action} ${confirmDialog.user?.email}?`}
        confirmText={confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
        isDestructive={confirmDialog.action === 'deactivate'}
      />
    </div>
  );
};

export default AdminDashboard;
