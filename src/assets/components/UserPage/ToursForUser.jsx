import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from "../../../firebase.js";


const ToursForUser = (status, userId) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const loadData = () => {
      setLoading(true);
      setError(null);

      if (!userId) {
        setTours([]);
        setLoading(false);
        return;
      }

      const toursRef = ref(db, `users/${userId}/tours`);

      unsubscribe = onValue(toursRef, (snapshot) => {
        if (snapshot.exists()) {
          const toursData = snapshot.val();
          const toursArray = Object.entries(toursData)
            .filter(([, tour]) => tour.status === status)
            .map(([tourId, tourData]) => ({
              tourId: tourId,
              ...tourData,
            }));
          setTours(toursArray);
          setLoading(false);
        } else {
          setTours([]);
          setLoading(false);
        }
      }, (error) => {
        console.error('Ошибка при подписке на изменения:', error);
        setError(error);
        setLoading(false);
      });
    };

    loadData();

    return () => {
      if (unsubscribe) {
        off(ref(db, `users/${userId}/tours`), 'value', unsubscribe);
      }
    };
  }, [status, userId]);

  return { tours, loading, error };
};


export default ToursForUser;