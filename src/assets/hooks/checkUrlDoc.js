import {get, ref} from "firebase/database";

async function checkUrlDoc(db, tour) {
  const tourRef = ref(db, `users/${tour.userId}/tours/${tour.tourId}`);

  try {
    const snapshot = await get(tourRef);
    if (snapshot.exists() && snapshot.hasChild('urlDoc')) {
      const existingUrlDoc = snapshot.child('urlDoc').val();
      return existingUrlDoc;
    }
  } catch (error) {
    console.error('Ошибка при получении ссылки на документ:', error);
  }
};

export default checkUrlDoc;