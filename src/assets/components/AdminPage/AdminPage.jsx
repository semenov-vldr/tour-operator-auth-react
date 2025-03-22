import "../UserPage/UserPage.sass";
import { useState, useEffect } from "react";

import { ref, get, update, remove } from "firebase/database";
import { db } from "../../../firebase.js";
import useAuth from "../../hooks/useAuth.js";

import TourCard from "../TourCard/TourCard";
import AlertDialog from "../AlertDialog/AlertDialog";
import NavigateToTravelAgencies from "../NavigateToTravelAgencies/NavigateToTravelAgencies";

import useNewAdminTours from "./useNewAdminTours";
import NewAcceptedTours from "./NewAcceptedTours";
import fetchNewRejectedTours from "./fetchNewRejectedTours";


const AdminPage = () => {
  //const userId = useAuth();
  const userId = "BXIjBvVqe5XNRndLhHSiveR2Jzk2";
  //const userId = "NUA8MNAZe1QnTzm1gi805KWOjVj1";

  const { newToursAdmin } = useNewAdminTours();
  const { acceptedToursAdmin } = NewAcceptedTours();
  const { rejectedToursAdmin } = fetchNewRejectedTours();

  const [newTours, setNewTours] = useState([]);
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);
  const [loading, setLoading] = useState(true);


  // Окно поп-ап подтверждения действия с карточкой тура
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
  // Текст для диалогового окна после действия с карточкой тура
  const [textAlertDialog, setTextAlertDialog] = useState("");
  // Состояние для хранения информации о действии
  const [actionDataAlertDialog, setActionDataAlertDialog] = useState({
    tourId: null,
    actionType: null,
  });


  // Открытие/закрытие диалогового окна (окно подтверждения действия)
  const handleOpenAlertDialog = () => setIsOpenAlertDialog(true);
  const handleCloseAlertDialog = () => setIsOpenAlertDialog(false);








  useEffect(() => {
    if (userId) {
      Promise.all([

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


  return (
    <main className="main userPage">
      <div className="userPage__container container">

        <NavigateToTravelAgencies route="there" />

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
                    acceptedToursAdmin.length > 0 && (
                      acceptedToursAdmin.map(acceptedTour => (
                        <TourCard
                          userId={acceptedTour.userId}
                          key={acceptedTour.tourId}
                          tour={acceptedTour}
                          deleteTour={() => handleDelete(acceptedTour.tourId)}
                          handleReject={() => handleReject(acceptedTour.tourId)}
                          handleAccept={() =>handleAccept(acceptedTour.tourId)}
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
                    rejectedToursAdmin.length > 0 && (
                      rejectedToursAdmin.map(rejectedTour => (
                        <TourCard
                          userId={rejectedTour.userId}
                          key={rejectedTour.tourId}
                          tour={rejectedTour}
                          deleteTour={() => handleDelete(rejectedTour.tourId)}
                          handleReject={() => handleReject(rejectedTour.tourId)}
                          handleAccept={() =>handleAccept(rejectedTour.tourId)}
                          showButtons={false}
                        />
                      ))
                    ) || <span>Отклоненных заявок нет</span>
                  }
                </div>
              </section>
            </>
          )
        }

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