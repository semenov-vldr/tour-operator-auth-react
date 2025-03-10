import CloseIcon from "../../icons/close.svg";


const TourCard = ({ tour, userData, deleteTour, handleReject, handleAccept, onDetailsClick, showButtons }) => {

  //const owner = userIds.find(userId => userId === tour.userId);
  //console.log(owner)

  return (
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
          {tour.date_start} - {tour.date_end}</div>
      </div>
      <div className="userPage__card-buttons">
        {
          showButtons &&
          <>
            <button onClick={handleReject} className="button button-cancel">Отклонить</button>
            <button onClick={handleAccept} className="button button-success">Принять</button>
          </>
        }
        <button onClick={onDetailsClick} className="button button-outline">Подробнее</button>
      </div>
    </article>
  );
};

export default TourCard;