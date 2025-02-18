import "./UserPage.sass"
import { useState, useEffect } from "react";

import ModalTourDesc from "../ModalTourDesc/ModalTourDesc.jsx";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../../firebase.js";
import useAuth from "../../hooks/useAuth.js";

import ButtonCreateTest from "../ButtonCreate/ButtonCreateTest";
import TourCard from "../TourCard/TourCard.jsx";
import CloseIcon from "../../icons/close.svg";


const UserPage = () => {
  const userId = useAuth();
  const [newTours, setNewTours] = useState([]);
  const [toursId, setToursId] = useState([]);
  const [userData, setUserData] = useState([]);

  // состояние для открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Определяем по какой карточки тура кликнули кнопку "Подробнее" для вызова модального окна
  const [selectedTour, setSelectedTour] = useState({});

  // Функция для открытия модального окна
  const handleOpenModal = (tour) => {
    setIsModalOpen(true);
    setSelectedTour(tour);
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTour({});
  };



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

          <div className="userPage__cards">

            {
              newTours.length ? (
              newTours.map((newTour, index) => (
                <TourCard
                  key={index}
                  newTour={newTour}
                  tourId={toursId[index]}
                  userData={userData}
                  deleteTour={deleteTour}
                  handleReject={handleReject}
                  handleAccept={handleAccept}
                  onDetailsClick={() => handleOpenModal(newTour)}
                  showButtons={true}
                />
              ))
              ) : <div>Новых заявок нет</div>
            }
          </div>

          <ModalTourDesc userData={userData} tour={selectedTour} isOpen={isModalOpen} onClose={handleCloseModal} />

        </section>


      </div>
    </main>
  );
};

export default UserPage;