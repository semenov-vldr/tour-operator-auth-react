import "./UserPage.sass";
import { useState, useEffect } from "react";

import ModalTourDesc from "../ModalTourDesc/ModalTourDesc";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../../firebase.js";
import useAuth from "../../hooks/useAuth.js";

import ButtonCreate from "../ButtonCreate/ButtonCreate";
import TourCard from "../TourCard/TourCard";
import AlertDialog from "../AlertDialog/AlertDialog";


const UserPage = () => {
  const userId = useAuth();
  const [newTours, setNewTours] = useState([]);
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);
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


  // Рендер новых заявок
  const fetchNewTours = async () => {
    const dbToursRef = ref(db, `users/${userId}/tours`);
    const snapshotTours = await get(dbToursRef);
    if (snapshotTours.exists()) {
      const tours = Object.entries(snapshotTours.val())
        .filter(([, tour]) => tour.status === "new")
        .map(([, tourData]) => ({
          ...tourData
        }));
      setNewTours(tours);
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
        .map(([, tourData]) => ({
          ...tourData
        }));
      setAcceptedTours(tours);
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
        .map(([, tourData]) => ({
          ...tourData
        }));
      setRejectedTours(tours);
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


  useEffect(() => {
    if (userId) {
      Promise.all([
        fetchNewTours(),
        fetchAcceptedTours(),
        fetchRejectedTours(),
        fetchUserData()
      ]).then(() => setLoading(false));
    }

  }, [userId, db]);
// ------------------------------


// Установка статуса заявки в БД (отклонено/принято)
  async function updateTourStatus (tourId, status) {
    const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
    try {
      await update(tourRef, { status: status });

      switch (status) {
        case true:
          setNewTours(newTours.filter(tour => tour.tourId !== tourId));
          setAcceptedTours([...acceptedTours, newTours.find(tour => tour.tourId === tourId)]);
          break;

        case false:
          setNewTours(newTours.filter(tour => tour.tourId !== tourId));
          setRejectedTours([...rejectedTours, newTours.find(tour => tour.tourId === tourId)]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса тура:', error);
    }
  };



// Обработчики для кнопок "принять"/"отклонить"
  const handleAccept = (tourId) => {
    const confirmation = confirm("Вы действительно хотите принять заявку?");
    if (confirmation) {
      updateTourStatus(tourId,true);
    }
  };

  const handleReject = (tourId) => {
    const confirmation = confirm("Вы действительно хотите отклонить заявку?");
    if (confirmation) {
      updateTourStatus(tourId,false);
    }
  };


  const deleteTour = async (tourId) => {
    const confirmation = confirm(`Вы действительно хотите принять заявку? TourID: ${tourId}`);
    if (confirmation) {
      const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
      try {
        await remove(tourRef);

        setNewTours(newTours.filter(tour => tour.tourId !== tourId));
        setAcceptedTours(acceptedTours.filter(tour => tour.tourId !== tourId));
        setRejectedTours(rejectedTours.filter(tour => tour.tourId !== tourId));
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

        <ButtonCreate fetchNewTours={fetchNewTours} />

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
                      newTours.map(newTour => (
                        <TourCard
                          key={newTour.tourId}
                          tour={newTour}
                          userData={userData}
                          deleteTour={() => deleteTour(newTour.tourId)}
                          handleReject={() => handleReject(newTour.tourId)}
                          handleAccept={() =>handleAccept(newTour.tourId)}
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
                      acceptedTours.map(acceptedTour => (
                        <TourCard
                          key={acceptedTour.tourId}
                          tour={acceptedTour}
                          userData={userData}
                          deleteTour={() => deleteTour(acceptedTour.tourId)}
                          handleReject={() => handleReject(acceptedTour.tourId)}
                          handleAccept={() =>handleAccept(acceptedTour.tourId)}
                          onDetailsClick={() => handleOpenModal(acceptedTour)}
                          showButtons={false}
                        />
                      ))
                    ) || <span>0</span>
                  }
                </div>
              </section>

              <section className="userPage__section">
                <h2 className="title-section red">Отклоненные заявки</h2>

                <div className="userPage__cards">
                  {
                    rejectedTours.length > 0 && (
                      rejectedTours.map(rejectedTour => (
                        <TourCard
                          key={rejectedTour.tourId}
                          tour={rejectedTour}
                          userData={userData}
                          deleteTour={() => deleteTour(rejectedTour.tourId)}
                          handleReject={() => handleReject(rejectedTour.tourId)}
                          handleAccept={() =>handleAccept(rejectedTour.tourId)}
                          onDetailsClick={() => handleOpenModal(rejectedTour)}
                          showButtons={false}
                        />
                      ))
                    ) || <span>0</span>
                  }
                </div>
              </section>
            </>
          )
        }

        <ModalTourDesc userData={userData} tour={selectedTour} isOpen={isModalOpen} onClose={handleCloseModal} />
        <AlertDialog />

      </div>
    </main>
  );
};

export default UserPage;