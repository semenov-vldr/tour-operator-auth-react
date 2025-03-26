import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from "../../../firebase.js";

const fetchToursForUser = async (userId, status) => {
  const toursRef = ref(db, `users/${userId}/tours`);
  return new Promise((resolve, reject) => {
    onValue(toursRef, (snapshot) => {
      if (snapshot.exists()) {
        const toursData = snapshot.val();
        const toursArray = Object.entries(toursData)
          .filter(([, tour]) => tour.status === status)
          .map(([, tourData]) => ({
            ...tourData,
          }));
        resolve(toursArray);
      } else {
        resolve([]);
      }
    }, reject);
  });
};



const ToursForUser = (status, userId) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const toursData = await fetchToursForUser(userId, status)
        setTours(toursData);
        setLoading(false);
      }
      catch (err) {
        console.error('Ошибка:', err);
        setError(err);
        setLoading(false);
      }
    };

    loadData();
  }, [status, userId]);

  return { tours, loading, error };
};

export default ToursForUser;