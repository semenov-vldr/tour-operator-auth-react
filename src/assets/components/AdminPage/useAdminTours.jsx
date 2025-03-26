import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from "../../../firebase.js";

const useAdminTours = (status, userId = null) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setError(null);

      const toursRef = userId
        ? ref(db, `users/${userId}/tours`) // Запрос для конкретного пользователя
        : ref(db, 'users');                // Запрос для всех пользователей

      onValue(toursRef, (snapshot) => {

        if (userId) { // Обработка данных для конкретного пользователя
          if (snapshot.exists()) {
            const toursData = snapshot.val();
            const toursArray = Object.entries(toursData)
              .filter(([, tour]) => tour.status === status)
              .map(([, tourData]) => ({
                ...tourData,
              }));
            setTours(toursArray);
            setLoading(false);
          } else {
            setTours([]);
            setLoading(false);
          }
        } else {  // Обработка данных для всех пользователей
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const userIds = Object.keys(usersData);

            const allToursPromises = userIds.map(async (currentUserId) => {
              return new Promise(resolve => {
                const dbToursRef = ref(db, `users/${currentUserId}/tours`);

                onValue(dbToursRef, (snapshotTours) => {
                  if (snapshotTours.exists()) {
                    const tours = Object.entries(snapshotTours.val())
                      .filter(([, tour]) => tour.status === status)
                      .map(([, tourData]) => ({
                        ...tourData,
                      }));
                    resolve(tours);
                  } else {
                    resolve([]);
                  }
                });
              });
            });

            Promise.all(allToursPromises)
              .then((allToursArrays) => {
                const allTours = allToursArrays.flat();
                setTours(allTours);
                setLoading(false);
              })
              .catch((err) => {
                console.error('Ошибка при получении данных:', err);
                setError(err);
                setLoading(false);
              });
          } else {
            setTours([]);
            setLoading(false);
          }
        }
      }, (error) => {
        console.error('Ошибка при подписке на изменения:', error);
        setError(error);
        setLoading(false);
      });
    };

    loadData();
  }, [status, userId]); // status and userID as dependency

  return { tours, loading, error };
};

export default useAdminTours;