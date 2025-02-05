import { createContext, useContext, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = change.doc.data();
          toast.info(notification.message);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
      <ToastContainer position="bottom-right" />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
