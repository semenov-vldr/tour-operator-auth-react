import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from "../../../firebase.js";


const ToursForAdmin = (status) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const loadData = () => {
      setLoading(true);
      setError(null);

      const usersRef = ref(db, 'users');

      unsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userIds = Object.keys(usersData);

          // Use Promise.all to fetch tours concurrently
          Promise.all(userIds.map(async (currentUserId) => {
            const userToursRef = ref(db, `users/${currentUserId}/tours`);
            return new Promise(resolve => { // convert onValue to promise
              onValue(userToursRef, (snapshotTours) => {
                if (snapshotTours.exists()) {
                  const tours = Object.entries(snapshotTours.val())
                    .filter(([, tour]) => tour.status === status)
                    .map(([tourId, tourData]) => ({
                      tourId: tourId, // add tourId
                      userId: currentUserId, // add userId
                      ...tourData,
                    }));
                  resolve(tours);
                } else {
                  resolve([]);
                }
              });
            });

          })).then(allToursArrays => {
            const allTours = allToursArrays.flat();
            setTours(allTours);
            setLoading(false);
          }).catch(err => {
            console.error('Ошибка при получении данных:', err);
            setError(err);
            setLoading(false);
          });

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
        off(ref(db, 'users'), 'value', unsubscribe);
      }
    };
  }, [status]);

  return { tours, loading, error };
};

export default ToursForAdmin;