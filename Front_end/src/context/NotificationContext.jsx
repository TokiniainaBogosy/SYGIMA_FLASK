import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connexion au serveur Socket.IO
    const newSocket = io('http://localhost:8000', {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur Socket.IO');
      // Rejoindre la room de l'utilisateur
      newSocket.emit('join', { userId });
    });

    newSocket.on('new_notification', (notification) => {
      console.log('📬 Nouvelle notification reçue:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Notification navigateur
      if (Notification.permission === 'granted') {
        new Notification('Nouvelle notification', {
          body: notification.message,
          icon: '/logo.png'
        });
      }
    });

    setSocket(newSocket);

    // Charger les notifications existantes
    fetchNotifications(userId);

    // Demander permission pour les notifications navigateur
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => newSocket.close();
  }, [userId]);

  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/${userId}`);
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markAsRead(n.id);
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};