import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      console.warn('userId non défini');
      return;
    }

    // Connexion Socket.IO
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
      newSocket.emit('join', { userId: parseInt(userId) });
    });

    newSocket.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.IO');
    });

    newSocket.on('new_notification', (notification) => {
      console.log('Nouvelle notification reçue:', notification);
      
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
    fetchNotifications();

    // Demander permission notifications
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Déconnexion Socket.IO');
      newSocket.close();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token manquant');
        return;
      }

      console.log('Chargement des notifications...');
      
      // ✅ Utiliser /my-notifications au lieu de /${userId}
      const { 
        data: notifications, 
        loading: loadingNotifications, 
        error: errorNotifications,
        setData: setNotifications // Utile si vous voulez vider/mettre à jour la liste manuellement plus tard
      } = useApi('/api/notifications/my-notifications');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Notifications reçues:', data);

      const notificationsList = data.notifications || [];
      setNotifications(notificationsList);
      setUnreadCount(notificationsList.filter(n => !n.read).length);
      
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `http://localhost:8000/api/notifications/${notificationId}/read`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log(`Notification ${notificationId} marquée comme lue`);
      
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        'http://localhost:8000/api/notifications/mark-all-read',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      console.log('Toutes les notifications marquées comme lues');
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};