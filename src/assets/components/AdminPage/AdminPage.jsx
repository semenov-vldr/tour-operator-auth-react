import "../UserPage/UserPage.sass";
import { useState, useEffect } from "react";

import ModalTourDesc from "../ModalTourDesc/ModalTourDesc";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../../firebase.js";
import useAuth from "../../hooks/useAuth.js";


import TourCard from "../TourCard/TourCard";
import AlertDialog from "../AlertDialog/AlertDialog";
import ButtonNavigateToTravelAgencies from "../ButtonNavigateToTravelAgencies/ButtonNavigateToTravelAgencies";


const AdminPage = () => {
  const userId = useAuth();

  const [newTours, setNewTours] = useState([]);
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  // состояние для открытия/закрытия модального окна
  const [isModalTourOpen, setIsModalTourOpen] = useState(false);
  // Определяем по какой карточки тура кликнули кнопку "Подробнее" для вызова модального окна
  const [selectedTour, setSelectedTour] = useState({});

  // Окно поп-ап подтверждения действия с карточкой тура
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
  // Текст для диалогового окна после действия с карточкой тура
  const [textAlertDialog, setTextAlertDialog] = useState("");
  // Состояние для хранения информации о действии
  const [actionDataAlertDialog, setActionDataAlertDialog] = useState({
    tourId: null,
    actionType: null,
  });

  // Функция для открытия модального окна
  const handleOpenModalDetails = (tour) => {
    setIsModalTourOpen(true);
    setSelectedTour(tour);
  };

  // Функция для закрытия модального окна
  const handleCloseModalDetails = () => {
    setIsModalTourOpen(false);
    setSelectedTour({});
  };


  // Открытие/закрытие диалогового окна (окно подтверждения действия)
  const handleOpenAlertDialog = () => setIsOpenAlertDialog(true);
  const handleCloseAlertDialog = () => setIsOpenAlertDialog(false);


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








  // -------- Код для страницы АДМИНА ---------------------

  const getAllUserIds = async () => {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.keys(usersData); // Возвращает массив ключей (userId)
      } else {
        return []; // Нет пользователей
      }
    } catch (error) {
      console.error('Ошибка при получении UserID:', error);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  };

  const fetchNewToursForAdmin = async (userIds, setNewTours) => {
    let allNewTours = []; // Массив для хранения всех новых туров от всех пользователей

    for (const userId of userIds) {
      try {
        const dbToursRef = ref(db, `users/${userId}/tours`);
        const snapshotTours = await get(dbToursRef);

        if (snapshotTours.exists()) {
          const tours = Object.entries(snapshotTours.val())
            .filter(([, tour]) => tour.status === "new")
            .map(([, tourData]) => ({
              userId: userId,
              ...tourData,
            }));
          allNewTours = allNewTours.concat(tours); // Добавляем туры к общему массиву
        }
      } catch (error) {
        console.error(`Ошибка при получении туров для пользователя ${userId}:`, error);
      }
    }
    setNewTours(allNewTours); // Устанавливаем все туры в состояние
  };


  const [newToursAdmin, setNewToursAdmin] = useState([]);
  const [userIds, setUserIds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const allUserIds = await getAllUserIds(); // Получаем все UserID
      setUserIds(allUserIds);
    };
    loadData();
    userIds && fetchNewToursForAdmin(userIds, setNewToursAdmin);
  }, [userIds]);



  // ------------------------------- КОНЕЦ Кода для страницы АДМИНА ---------------------

  useEffect(() => {
    if (userId) {
      Promise.all([
        fetchNewTours(),
        fetchAcceptedTours(),
        fetchRejectedTours(),
        fetchUserData(),
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


  // Подтверждение действия в диалоговом окне (принять/отклонить)
  const handleConfirmAction = () => {
    const { tourId, actionType } = actionDataAlertDialog;

    if (!tourId || !actionType) {
      console.warn("Недостаточно информации для выполнения действия.");
      handleCloseAlertDialog();
      return;
    }

    switch (actionType) {
      case 'accept':
        updateTourStatus(tourId, true);
        break;
      case 'reject':
        updateTourStatus(tourId, false);
        break;
      case 'delete':
        deleteTour(tourId);
        break;
      default:
        console.warn("Неизвестный тип действия:", actionType);
    }
    handleCloseAlertDialog();
    setActionDataAlertDialog({ tourId: null, actionType: null }); // Сбрасываем состояние
  };



// --- Обработчики для кнопок "принять"/"отклонить"/"удалить" ---
  const handleAction = (tourId, actionType) => {
    const actionTexts = {
      accept: "Вы действительно хотите принять заявку на тур?",
      reject: "Вы действительно хотите отклонить заявку?",
      delete: "Вы действительно хотите удалить заявку на тур?",
    };
    const text = actionTexts[actionType];
    if (!text) {
      console.error("Неизвестный тип действия:", actionType);
      return;
    }

    handleOpenAlertDialog();
    setTextAlertDialog(text);
    setActionDataAlertDialog({ tourId: tourId, actionType: actionType });
  };

  const handleAccept = (tourId) => handleAction(tourId, "accept");
  const handleReject = (tourId) => handleAction(tourId, "reject");
  const handleDelete = (tourId) => handleAction(tourId, "delete");
  // -----------



  async function deleteTour (tourId) {
    const text = "Вы действительно хотите принять заявку?";
    handleOpenAlertDialog();
    setTextAlertDialog(text);
    const tourRef = ref(db, `users/${userId}/tours/${tourId}`);
    try {
      await remove(tourRef);

      setNewTours(newTours.filter(tour => tour.tourId !== tourId));
      setAcceptedTours(acceptedTours.filter(tour => tour.tourId !== tourId));
      setRejectedTours(rejectedTours.filter(tour => tour.tourId !== tourId));
    } catch (error) {
      console.error("Ошибка при удалении тура: ", error);
    }
  };

  //console.log(newToursAdmin)


  return (
    <main className="main userPage">
      <div className="userPage__container container">

        <ButtonNavigateToTravelAgencies route="there" />

        {
          loading ? (
            <span>Загрузка...</span>
          ) : (
            <>

              <section className="userPage__section">
                <h2 className="title-section yellow">Новые заявки</h2>

                <div className="userPage__cards">

                  {
                    newToursAdmin.length > 0 ? (
                      newToursAdmin.map(newTourAdmin => (
                        <TourCard
                          userId={newTourAdmin.userId}
                          key={newTourAdmin.tourId}
                          tour={newTourAdmin}
                          deleteTour={() => handleDelete(newTourAdmin.tourId)}
                          handleReject={() => handleReject(newTourAdmin.tourId)}
                          handleAccept={() =>handleAccept(newTourAdmin.tourId)}
                          onDetailsClick={() => handleOpenModalDetails(newTourAdmin)}
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
                          userId={acceptedTour.userId}
                          key={acceptedTour.tourId}
                          tour={acceptedTour}
                          deleteTour={() => handleDelete(acceptedTour.tourId)}
                          handleReject={() => handleReject(acceptedTour.tourId)}
                          handleAccept={() =>handleAccept(acceptedTour.tourId)}
                          onDetailsClick={() => handleOpenModalDetails(acceptedTour)}
                          showButtons={false}
                        />
                      ))
                    ) || <span>Новых одобренных нет</span>
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
                          userId={rejectedTour.userId}
                          key={rejectedTour.tourId}
                          tour={rejectedTour}
                          deleteTour={() => handleDelete(rejectedTour.tourId)}
                          handleReject={() => handleReject(rejectedTour.tourId)}
                          handleAccept={() =>handleAccept(rejectedTour.tourId)}
                          onDetailsClick={() => handleOpenModalDetails(rejectedTour)}
                          showButtons={false}
                        />
                      ))
                    ) || <span>Нет отклоненных заявок</span>
                  }
                </div>
              </section>
            </>
          )
        }

        <ModalTourDesc
          userData={userData}
          tour={selectedTour}
          isOpen={isModalTourOpen}
          onClose={handleCloseModalDetails}
        />

        <AlertDialog
          isOpen={isOpenAlertDialog}
          onClose={handleCloseAlertDialog}
          onConfirm={handleConfirmAction}
          text={textAlertDialog}
        />

      </div>
    </main>
  );
};

export default AdminPage;