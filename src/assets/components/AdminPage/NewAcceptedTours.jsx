import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from "../../../firebase.js";

const NewAcceptedTours = () => {
  const [acceptedToursAdmin, setAcceptedToursAdmin] = useState([]);
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
                .filter(([, tour]) => tour.status === true)
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

          setAcceptedToursAdmin(allNewTours);
        } else {
          setAcceptedToursAdmin([]);
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

  return { acceptedToursAdmin, loading, error };
};

export default NewAcceptedTours;