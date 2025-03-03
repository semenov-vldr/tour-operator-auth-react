import "./UserPage.sass";
import { useState, useEffect } from "react";

import ModalTourDesc from "../ModalTourDesc/ModalTourDesc.jsx";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../../firebase.js";
import useAuth from "../../hooks/useAuth.js";

import ButtonCreateTest from "../ButtonCreate/ButtonCreateTest";
import TourCard from "../TourCard/TourCard.jsx";


const UserPage = () => {
  const userId = useAuth();
  const [newTours, setNewTours] = useState([]);
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);
  const [toursId, setToursId] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

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
// const fetchTours = async () => {
//   const dbToursRef = ref(db, `users/${userId}/tours`);
//   const snapshotTours = await get(dbToursRef);
//   if (snapshotTours.exists()) {
//     setNewTours(Object.values(snapshotTours.val()));
//     setToursId(Object.keys(snapshotTours.val()));
//   }
// };


  // Рендер новых заявок
  const fetchNewTours = async () => {
    const dbToursRef = ref(db, `users/${userId}/tours`);
    const snapshotTours = await get(dbToursRef);
    if (snapshotTours.exists()) {
      const tours = Object.entries(snapshotTours.val())
        .filter(([, tour]) => tour.status === "")
        .map(([tourId, tourData]) => ({
          id: tourId,
          ...tourData
        }));
      setNewTours(tours);
      setToursId(Object.keys(snapshotTours.val()));
    } else {
      setNewTours([]);
    }
  };

  // Рендер принятых заявок
  const fetchAcceptedTours = async () => {
    const dbToursRef = ref(db, `users/${userId}/tours`);
    const snapshotTours = await get(dbToursRef);
    if (snapshotTours.exists()) {
      const tours = Object.entries(snapshotTours.val())
        .filter(([, tour]) => tour.status === true)
        .map(([tourId, tourData]) => ({
          id: tourId,
          ...tourData
        }));
      setAcceptedTours(tours);
      setToursId(Object.keys(snapshotTours.val()));
    } else {
      setAcceptedTours([]);
    }
  };


  // Рендер отклоненных заявок
  const fetchRejectedTours = async () => {
    const dbToursRef = ref(db, `users/${userId}/tours`);
    const snapshotTours = await get(dbToursRef);
    if (snapshotTours.exists()) {
      const tours = Object.entries(snapshotTours.val())
        .filter(([, tour]) => tour.status === false)
        .map(([tourId, tourData]) => ({
          id: tourId,
          ...tourData
        }));
      setRejectedTours(tours);
      setToursId(Object.keys(snapshotTours.val()));
    } else {
      setRejectedTours([]);
    }
  };


// Получение данных для кнопки "Подробнее"
const fetchUserData = async () => {
  const dbUserDataRef = ref(db, `users/${userId}`);
  const snapshotUserData = await get(dbUserDataRef);
  if (snapshotUserData.exists()) {
    setUserData(snapshotUserData.val());
  }
};


// useEffect(() => {
//  if (userId) {
//    fetchTours();
//    fetchUserData();
//    setLoading(false);
//  }
// }, [userId, db]);


  useEffect(() => {
    if (userId) {
      Promise.all([
        fetchNewTours(),
        fetchAcceptedTours(),
        fetchRejectedTours(),
        fetchUserData()
      ]).then(() => setLoading(false));
    }

    console.log(acceptedTours)
  }, [userId, db]);
// ------------------------------


// Установка статуса заявки в БД (отклонено/принято)
async function updateTourStatus (tourId, status) {
  const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
  try {
    await update(tourRef, { status: status });

    switch (status) {
      case true:
        setNewTours(newTours.filter(tour => tour.id !== tourId));
        setAcceptedTours([...acceptedTours, newTours.find(tour => tour.id === tourId)]);
        break;

      case false:
        setNewTours(newTours.filter(tour => tour.id !== tourId));
        setRejectedTours([...rejectedTours, newTours.find(tour => tour.id === tourId)]);
        break;
      default:
        break;
    }
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
    if (confirmation) {
      updateTourStatus(tourId,true);
    }
  };

  const handleReject = (event) => {
    const tourId = getTourId(event);
    //updateTourStatus(tourId,false);
    const confirmation = confirm("Вы действительно хотите отклонить заявку?");
    if (confirmation) {
      updateTourStatus(tourId,false);
    }
  };


  const deleteTour = async (event) => {
    const confirmation = confirm("Вы действительно хотите принять заявку?");
    if (confirmation) {
      const tourId = getTourId(event);
      const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
      try {
        await remove(tourRef);

        setNewTours(newTours.filter(tour => tour.id !== tourId));
        setAcceptedTours(acceptedTours.filter(tour => tour.id !== tourId));
        setRejectedTours(rejectedTours.filter(tour => tour.id !== tourId));

        // fetchTours();
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

        {
          loading ? (
            <span>Загрузка...</span>
          ) : (
            <>
              <section className="userPage__section">
                <h2 className="title-section yellow">Новые заявки</h2>

                <div className="userPage__cards">

                  {
                      newTours.length > 0 ? (
                        newTours.map((newTour, index) => (
                          <TourCard
                            key={index}
                            tour={newTour}
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

              </section>

              <section className="userPage__section">
                <h2 className="title-section green">Одобренные заявки</h2>

                <div className="userPage__cards">
                  {
                      acceptedTours.length > 0 && (
                      acceptedTours.map((acceptedTour, index) => (
                          <TourCard
                            key={index}
                            tour={acceptedTour}
                            tourId={toursId[index]}
                            userData={userData}
                            deleteTour={deleteTour}
                            handleReject={handleReject}
                            handleAccept={handleAccept}
                            onDetailsClick={() => handleOpenModal(acceptedTour)}
                            showButtons={false}
                          />
                        ))
                      )
                  }
                </div>
              </section>

              <section className="userPage__section">
                <h2 className="title-section red">Отклоненные заявки</h2>

                <div className="userPage__cards">
                  {
                      rejectedTours.length > 0 && (
                      rejectedTours.map((rejectedTour, index) => (
                          <TourCard
                            key={index}
                            tour={rejectedTour}
                            tourId={toursId[index]}
                            userData={userData}
                            deleteTour={deleteTour}
                            handleReject={handleReject}
                            handleAccept={handleAccept}
                            onDetailsClick={() => handleOpenModal(rejectedTour)}
                            showButtons={false}
                          />
                        ))
                      )
                  }
                </div>
              </section>
            </>
          )
        }

        <ModalTourDesc userData={userData} tour={selectedTour} isOpen={isModalOpen} onClose={handleCloseModal} />

      </div>
    </main>
  );
};

export default UserPage;