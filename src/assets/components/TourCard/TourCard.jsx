import CloseIcon from "../../icons/close.svg";
import {useEffect, useState} from "react";
import { ref, get, update, remove } from "firebase/database";
import {db} from "../../../firebase.js";
import ModalTourDesc from "../ModalTourDesc/ModalTourDesc";
import AlertDialog from "../AlertDialog/AlertDialog";
import YandexDriveUpload from "../YandexDriveUpload";



const TourCard = ({ tour, showButtons, accepted }) => {

  const [userData, setUserData] = useState([]);
  // Определяем по какой карточки тура кликнули кнопку "Подробнее" для вызова модального окна
  const [selectedTour, setSelectedTour] = useState({});
  // состояние для открытия/закрытия модального окна
  const [isModalTourOpen, setIsModalTourOpen] = useState(false);
  // Окно поп-ап подтверждения действия с карточкой тура
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
  // Текст для диалогового окна после действия с карточкой тура
  const [textAlertDialog, setTextAlertDialog] = useState("");
  // Состояние для хранения информации о действии
  const [actionDataAlertDialog, setActionDataAlertDialog] = useState(null);

  const pathUserTour = `users/${tour.userId}/tours/${tour.tourId}`;


  const fetchUserData = async () => {
    const dbUserDataRef = ref(db, `users/${tour.userId}`);
    const snapshotUserData = await get(dbUserDataRef);
    if (snapshotUserData.exists()) {
      setUserData(snapshotUserData.val());
    }
  };


  // Функция для открытия модального окна
  const handleOpenModalDetails = () => {
    setIsModalTourOpen(true);
    setSelectedTour(tour);
  };

  // Функция для закрытия модального окна
  const handleCloseModalDetails = () => {
    setIsModalTourOpen(false);
    setSelectedTour({});
  };

  useEffect(() => {
    fetchUserData();
  }, []);



  // Открытие/закрытие диалогового окна (окно подтверждения действия)
  const handleOpenAlertDialog = () => setIsOpenAlertDialog(true);
  const handleCloseAlertDialog = () => setIsOpenAlertDialog(false);

// Установка статуса заявки в БД (отклонено/принято)
  async function updateTourStatus (status) {
    const tourRef = ref(db, pathUserTour);
    try {
      await update(tourRef, { status: status });
    } catch (error) {
      console.error('Ошибка при обновлении статуса тура:', error);
    }
  };

  // Подтверждение действия в диалоговом окне (принять/отклонить)
  const handleConfirmAction = () => {

    if (!actionDataAlertDialog) {
      console.warn("Недостаточно информации для выполнения действия.");
      handleCloseAlertDialog();
      return;
    }

    switch (actionDataAlertDialog) {
      case 'accept':
        updateTourStatus(true);
        break;
      case 'reject':
        updateTourStatus(false);
        break;
      case 'delete':
        deleteTour();
        break;
      default:
        console.warn("Неизвестный тип действия:", actionDataAlertDialog);
    }
    handleCloseAlertDialog();
    setActionDataAlertDialog(null);
  };

  // --- Обработчики для кнопок "принять"/"отклонить"/"удалить" ---
  const handleAction = (actionDataAlertDialog) => {
    const actionTexts = {
      accept: "Вы действительно хотите принять заявку на тур?",
      reject: "Вы действительно хотите отклонить заявку на тур?",
      delete: "Вы действительно хотите удалить заявку на тур?",
    };
    const text = actionTexts[actionDataAlertDialog];
    if (!text) {
      console.error("Неизвестный тип действия:", actionDataAlertDialog);
      return;
    }

    handleOpenAlertDialog();
    setTextAlertDialog(text);
    setActionDataAlertDialog(actionDataAlertDialog);
  };

  async function deleteTour () {
    const tourRef = ref(db, pathUserTour);
    try {
      await remove(tourRef);
    } catch (error) {
      console.error("Ошибка при удалении тура: ", error);
    }
  };


  // Добавление ссылки на загруженный документ (pdf-программа) в БД
  async function addUrlDoc (urlDoc) {
    const tourRef = ref(db, pathUserTour);
    try {
      await update(tourRef, { urlDoc: urlDoc });
    } catch (error) {
      console.error('Ошибка при добавлении ссылки на документ:', error);
    }
  };

  const handleAccept = () => handleAction("accept");
  const handleReject = () => handleAction("reject");
  const handleDelete = () => handleAction("delete");

  // ------------------------

  return (
    <>
      <article className="userPage__card">
        <div className="userPage__card-top">
          <span className="userPage__card-sender">{userData.legal_name || "Компания неизвестна"}</span>
          <button onClick={() => handleDelete(tour.tourId)} className="userPage__card-close" title="Удалить заявку">
            <img src={CloseIcon} />
          </button>
        </div>

        <h3 className="userPage__card-title">{tour.name}</h3>
        <div className="userPage__card-data">
          <div className="userPage__card-data-item">
            <span>Количество чел:</span>
            {tour.number_of_people}</div>
          <div className="userPage__card-data-item">
            <span>Дата:</span>
            {tour.date_start} — {tour.date_end}</div>
        </div>


        <div className="userPage__card-buttons">
          {
            showButtons &&
            <>
              <button onClick={() => handleReject(tour.tourId)} className="button button-cancel">Отклонить</button>
              <button onClick={() => handleAccept(tour.tourId)} className="button button-success">Принять</button>
            </>
          }

          {
            accepted && <YandexDriveUpload addUrlDoc={addUrlDoc} tour={tour} />
          }


          <button onClick={handleOpenModalDetails} className="button button-outline">Подробнее</button>

        </div>


      </article>

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

    </>
  );
};

export default TourCard;