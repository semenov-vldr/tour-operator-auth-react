import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from "../../../firebase.js";

const fetchNewRejectedTours = () => {
  const [rejectedToursAdmin, setRejectedToursAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userIds = Object.keys(usersData);
          const allNewToursPromises = userIds.map(async (userId) => {
            const dbToursRef = ref(db, `users/${userId}/tours`);
            const snapshotTours = await get(dbToursRef);

            if (snapshotTours.exists()) {
              const tours = Object.entries(snapshotTours.val())
                .filter(([, tour]) => tour.status === false)
                .map(([, tourData]) => ({
                  userId: userId,
                  ...tourData,
                }));
              return tours;
            } else {
              return [];
            }
          });

          const allNewToursArrays = await Promise.all(allNewToursPromises); // Wait for all users
          const allNewTours = allNewToursArrays.flat(); // Flatten array

          setRejectedToursAdmin(allNewTours);
        } else {
          setRejectedToursAdmin([]);
        }
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { rejectedToursAdmin, loading, error };
};

export default fetchNewRejectedTours;