import { Modal, Box, Typography } from '@mui/material';
import "../ModalTourDesc/ModalTourDesc.sass";


const ModalUserData = ({userData, isOpen, onClose}) => {

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >

      <Box className="modal">
        <Typography variant="h6" component="h2">
          Данные компании:
        </Typography>

        <div className="modal__content">
          <ul className="modal__list">
            <li className="modal__item">
              <span>Юридическое название:</span>
              <span>{userData.legal_name}</span>
            </li>
            <li className="modal__item">
              <span>Торговое наименование:</span>
              <span>{userData.trade_name}</span>
            </li>
            <li className="modal__item">
              <span>ИНН:</span>
              <span>{userData.inn}</span>
            </li>
            <li className="modal__item">
              <span>КПП:</span>
              <span>{userData.kpp}</span>
            </li>
            <li className="modal__item">
              <span>Юридический адрес:</span>
              <span>{userData.legal_address}</span>
            </li>
            <li className="modal__item">
              <span>Фактический адрес:</span>
              <span>{userData.actual_address}</span>
            </li>
            <li className="modal__item">
              <span>Номер расчётного счёта в банке:</span>
              <span>{userData.bank_account_number}</span>
            </li>
            <li className="modal__item">
              <span>Корреспонденский счёт в банке:</span>
              <span>{userData.correspondent_account_number}</span>
            </li>
            <li className="modal__item">
              <span>БИК банка:</span>
              <span>{userData.bank_bik}</span>
            </li>
            <li className="modal__item">
              <span>Наименование и адрес местонахождения банка:</span>
              <span>{userData.bank_name_and_location}</span>
            </li>
            <li className="modal__item">
              <span>Ген.директор Турагентства:</span>
              <span>{userData.ceo_name}</span>
            </li>
            <li className="modal__item">
              <span>Контактное лицо от Турагентства:</span>
              <span>{userData.contact_person_name}</span>
            </li>
            <li className="modal__item">
              <span>Телефон:</span>
              <span>{userData.phone}</span>
            </li>
            <li className="modal__item">
              <span>Почта:</span>
              <span>{userData.email}</span>
            </li>
            <li className="modal__item">
              <span>Адрес для отправки Корреспонденции:</span>
              <span>{userData.correspondence_address}</span>
            </li>
            <li className="modal__item">
              <span>Дата регистрации:</span>
              <span>{userData.date_of_registration}</span>
            </li>

          </ul>
        </div>

      </Box>

    </Modal>
  );
};

export default ModalUserData;