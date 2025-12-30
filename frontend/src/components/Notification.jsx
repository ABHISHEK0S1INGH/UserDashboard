import { useState, useEffect } from 'react';

let notificationId = 0;

const Notification = ({ notifications, removeNotification }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <span>{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = notificationId++;
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const NotificationComponent = () => (
    <Notification
      notifications={notifications}
      removeNotification={removeNotification}
    />
  );

  return {
    showSuccess: (message) => addNotification(message, 'success'),
    showError: (message) => addNotification(message, 'error'),
    showInfo: (message) => addNotification(message, 'info'),
    showWarning: (message) => addNotification(message, 'warning'),
    NotificationComponent,
  };
};

export default Notification;
