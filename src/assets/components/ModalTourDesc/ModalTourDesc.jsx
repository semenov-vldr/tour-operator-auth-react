import {useState} from "react";
import { Modal, Box, Typography } from '@mui/material';
import "./ModalTourDesc.sass"


const ModalTourDesc = ({open, handleCloseModal}) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 600,
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
    >

      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Данные по туру:
        </Typography>

        <div className="modal__content">
          <ul className="modal__list">
            <li className="modal__item">
              <span>Компания:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Дата заявки:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Город поездки:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Дата начала:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Дата окончания:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Количество человек:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Питание:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Проживание:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Бюджет на чел:</span>
              <span>Ответ</span>
            </li>
            <li className="modal__item">
              <span>Комментарий:</span>
              <span>Ответ</span>
            </li>
          </ul>
        </div>

      </Box>

    </Modal>
  );
};

export default ModalTourDesc;