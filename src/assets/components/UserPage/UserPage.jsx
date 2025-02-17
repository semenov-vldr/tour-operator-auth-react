import "./UserPage.sass"
import { useState, useEffect } from "react";


import ModalTourDesc from "../ModalTourDesc/ModalTourDesc.jsx";
import { ref, get, update, remove } from "firebase/database";
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from "../../../firebase.js";

import ButtonCreateTest from "../ButtonCreate/ButtonCreateTest";
import CloseIcon from "../../icons/close.svg";


const UserPage = () => {
  const [newTours, setNewTours] = useState([]);
  const [toursId, setToursId] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState([]);

  // состояние для открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true); // Функция для открытия модального окна
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Функция для закрытия модального окна
  };



  // --- Дублированная функция (временная) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, [auth, setUserId]);



// --- Добавление карточек тура из БД ---
const fetchTours = async () => {
  const dbToursRef = ref(db, `users/${userId}/tours`);
  const dbUserDataRef = ref(db, `users/${userId}`);
  const snapshotTours = await get(dbToursRef);
  const snapshotUserData = await get(dbUserDataRef);
  if (snapshotTours.exists()) {
    setNewTours(Object.values(snapshotTours.val()));
    setToursId(Object.keys(snapshotTours.val()));
  }
  if (snapshotUserData.exists()) {
    setUserData(snapshotUserData.val());
  }
};

useEffect(() => {
 if (userId) fetchTours();
}, [userId, db]);
// ------------------------------


// Установка статуса заявки (отклонено/принято)
async function updateTourStatus (tourId, status) {
  const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
  try {
    await update(tourRef, {status: status});
  } catch (error) {
    console.error('Ошибка при обновлении статуса тура:', error);
  }
};

// Обработчики для кнопок "принять"/"отклонить"
const getTourId = (event) => event.target.closest(".userPage__card").dataset.id;

  const handleAccept = (event) => {
    const tourId = getTourId(event);
    //updateTourStatus(tourId,true);
    const confirmation = confirm("Вы действительно хотите принять заявку?");
    updateTourStatus(tourId,`${confirmation ? true : ""}`);
  };

  const handleReject = (event) => {
    const tourId = getTourId(event);
    //updateTourStatus(tourId,false);
    const confirmation = confirm("Вы действительно хотите отклонить заявку?");
    updateTourStatus(tourId,`${confirmation ? false : ""}`);
  };


  const deleteTour = async (event) => {
    const confirmation = confirm("Вы действительно хотите принять заявку?");
    if (confirmation) {
      const tourId = getTourId(event);
      const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
      try {
        await remove(tourRef);
        fetchTours();
      } catch (error) {
        console.error("Ошибка при удалении тура: ", error);
      }
    } else {
      console.log("Отмена удаления");
    }
  };

  return (
    <main className="main userPage">
      <div className="userPage__container container">

        <ButtonCreateTest />

        <section className="userPage__section">
          <h2 className="title-section yellow">Заявки в ожидании</h2>

          <ModalTourDesc open={isModalOpen} handleCloseModal={handleCloseModal} />

          <div className="userPage__cards">

            {
              newTours.length ? (
              newTours.map((newTour, index) => (
              <article key={index} data-id={toursId[index]} className="userPage__card">
                <div className="userPage__card-top">
                  <span className="userPage__card-sender">{userData.legal_name}</span>
                  <button onClick={deleteTour} className="userPage__card-close">
                    <img src={CloseIcon} />
                  </button>
                </div>

                <h3 className="userPage__card-title">{newTour.name}</h3>
                <div className="userPage__card-data">
                  <div className="userPage__card-data-item">
                    <span>Количество чел:</span>
                    {newTour.number_of_people}</div>
                  <div className="userPage__card-data-item">
                    <span>Дата:</span>
                    {newTour.date_start} - {newTour.date_end}</div>
                </div>
                <div className="userPage__card-buttons">
                  <button onClick={handleReject} className="button button-cancel">Отклонить</button>
                  <button onClick={handleAccept} className="button button-success">Принять</button>
                  <button onClick={handleOpenModal} className="button button-outline">Подробнее</button>
                </div>
              </article>
            ))
            ) : (
              <div>Новых заявок нет</div>
            )
            }



            <article className="userPage__card hidden">
              <div className="userPage__card-top">
                <span className="userPage__card-sender">ООО «Тревел Технологии»</span>
                <button className="userPage__card-close">
                  <img src={CloseIcon} />
                </button>
              </div>

              <h3 className="userPage__card-title">Тур в Адыгею. Плато Лаго-Наки</h3>
              <div className="userPage__card-data">
                <div className="userPage__card-data-item">
                  <span>Количество чел:</span>
                  50-60</div>
                <div className="userPage__card-data-item">
                  <span>Дата:</span>
                  01.01.2025 - 08.01.2025</div>
              </div>
              <div className="userPage__card-buttons">
                <button className="button button-cancel">Отклонить</button>
                <button className="button button-success">Принять</button>
                <button className="button button-outline">Подробнее</button>
              </div>
            </article>



          </div>
        </section>


      </div>
    </main>
  );
};

export default UserPage;