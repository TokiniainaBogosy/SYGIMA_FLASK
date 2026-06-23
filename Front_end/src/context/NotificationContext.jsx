import React, { createContext, useContext, useState, useEffect, use } from 'react';
import io from 'socket.io-client';
import { useApi } from '../hooks/useApi';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const NotificationContext = createContext();


export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data, loading, error, put } = useApi('/api/notifications/my-notifications');
  useEffect(() => {
  if (!data) return;
  const list = data.notifications || [];
  setNotifications(list);
  setUnreadCount(list.filter(n => !n.read).length);
}, [data]);

  useEffect(() => {
    if (!userId) {
      console.warn('userId non défini');
      return;
    }

    // Connexion Socket.IO
    const newSocket = io(`${API_URL}`, {
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
    // fetchNotifications();

    // Demander permission notifications
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Déconnexion Socket.IO');
      newSocket.close();
    };
  }, [userId]);

 

  const markAsRead = async (notificationId) => {
    await put(`/api/notifications/${notificationId}/read`);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  

  const markAllAsRead = async () => {
    await put(`/api/notifications/mark-all-read`);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
      
    console.log('✅ Toutes les notifications marquées comme lues');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      // refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};