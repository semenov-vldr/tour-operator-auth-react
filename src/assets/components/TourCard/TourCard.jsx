import CloseIcon from "../../icons/close.svg";


const TourCard = ({ newTour, tourId, userData, deleteTour, handleReject, handleAccept, onDetailsClick, showButtons }) => {
  return (
    <article data-id={tourId} className="userPage__card">
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
        { showButtons && <button onClick={handleReject} className="button button-cancel">Отклонить</button> }
        { showButtons && <button onClick={handleAccept} className="button button-success">Принять</button> }
        <button onClick={onDetailsClick} className="button button-outline">Подробнее</button>
      </div>
    </article>
  );
};

export default TourCard;