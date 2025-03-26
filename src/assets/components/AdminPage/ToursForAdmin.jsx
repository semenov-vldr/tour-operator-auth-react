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


const fetchAllTours = async (status) => {
  const usersRef = ref(db, 'users');
  return new Promise((resolve, reject) => {
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userIds = Object.keys(usersData);

        const allToursPromises = userIds.map(async (currentUserId) => {
          return fetchToursForUser(currentUserId, status);
        });

        Promise.all(allToursPromises)
          .then((allToursArrays) => {
            resolve(allToursArrays.flat());
          })
          .catch(reject);
      } else {
        resolve([]);
      }
    }, reject);
  });
};

const ToursForAdmin = (status) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const toursData = await fetchAllTours(status);

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
  }, [status]);

  return { tours, loading, error };
};

export default ToursForAdmin;