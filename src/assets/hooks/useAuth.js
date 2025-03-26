import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../firebase.js";


const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return { userId, loading };
};

export default useAuth;