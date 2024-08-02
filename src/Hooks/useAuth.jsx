// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(idTokenResult.claims.role === 'Admin');
        setUserDisplayName(idTokenResult.claims.name);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      Navigate("/");
    } catch (error) {
    }
  };

  return { user, loading, isAdmin, logout, userDisplayName };
};