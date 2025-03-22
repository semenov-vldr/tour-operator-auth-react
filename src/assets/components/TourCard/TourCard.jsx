import CloseIcon from "../../icons/close.svg";
import {useEffect, useState} from "react";
import {get, ref} from "firebase/database";
import {db} from "../../../firebase.js";
import ModalTourDesc from "../ModalTourDesc/ModalTourDesc";


const TourCard = ({ userId, tour, deleteTour, handleAccept, handleReject, showButtons }) => {

  const [userData, setUserData] = useState([]);
  // Определяем по какой карточки тура кликнули кнопку "Подробнее" для вызова модального окна
  const [selectedTour, setSelectedTour] = useState({});
  // состояние для открытия/закрытия модального окна
  const [isModalTourOpen, setIsModalTourOpen] = useState(false);

  const fetchUserData = async (userId) => {
    const dbUserDataRef = ref(db, `users/${userId}`);
    const snapshotUserData = await get(dbUserDataRef);
    if (snapshotUserData.exists()) setUserData(snapshotUserData.val());
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
    fetchUserData(userId);
  }, []);

  return (
    <>
    <article className="userPage__card">
      <div className="userPage__card-top">
        <span className="userPage__card-sender">{userData.legal_name || "Компания неизвестна"}</span>
        <button onClick={deleteTour} className="userPage__card-close">
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
            <button onClick={handleReject} className="button button-cancel">Отклонить</button>
            <button onClick={handleAccept} className="button button-success">Принять</button>
          </>
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

      </>
  );
};

export default TourCard;