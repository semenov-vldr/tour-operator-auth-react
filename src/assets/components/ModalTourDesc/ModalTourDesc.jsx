import { Modal, Box, Typography } from '@mui/material';
import "./ModalTourDesc.sass";
import CloseIcon from "../../icons/close.svg";


const ModalTourDesc = ({tour, userData, isOpen, onClose}) => {

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >

      <Box className="modal">
        <button onClick={onClose} className="modal__close">
          <img src={CloseIcon} width="32" />
        </button>
        <Typography variant="h6" component="h2">
          Данные по туру:
        </Typography>


        <div className="modal__content">
          <ul className="modal__list">
            <li className="modal__item">
              <span>Компания:</span>
              <span>{userData.legal_name}</span>
            </li>
            <li className="modal__item">
              <span>Дата заявки:</span>
              <span>{tour.date_creation || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Город поездки:</span>
              <span>{tour.name || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Дата начала:</span>
              <span>{tour.date_start || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Дата окончания:</span>
              <span>{tour.date_end || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Количество человек:</span>
              <span>{tour.number_of_people || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Питание:</span>
              <span>{tour.food || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Проживание:</span>
              <span>{tour.type_of_accommodation || "—"}</span>
            </li>
            <li className="modal__item">
              <span>Бюджет на чел:</span>
              <span>{tour.budget || "—"}</span>
            </li>
            {
              tour.comment && (
                <li className="modal__item">
                  <span>Комментарий:</span>
                  <span>{tour.comment}</span>
                </li>
              )
            }

          </ul>
        </div>

      </Box>

    </Modal>
  );
};

export default ModalTourDesc;