import "./DataAllUsers.sass";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper  } from '@mui/material';

import AccordionActions from '@mui/material/AccordionActions';
//import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {useEffect, useState} from "react";
import {db} from "../../../firebase.js";
import {get, ref} from "firebase/database";
import ButtonNavigateToTravelAgencies from "../ButtonNavigateToTravelAgencies/ButtonNavigateToTravelAgencies";


export default function DataAllUsers() {

  const [usersDb, setUsersDb] = useState([]);

  // Рендер принятых заявок
  const fetchUsersData = async () => {
    const dbToursRef = ref(db, `users`);
    const snapshotUsers= await get(dbToursRef);
    if (snapshotUsers.exists()) {
      const users = Object.entries(snapshotUsers.val())
        .map(([, tourData]) => ({
          ...tourData
        }));
      setUsersDb(users);
    } else {
      setUsersDb([]);
    }
  };

  useEffect(() => {
        fetchUsersData()
  },[db]);


  function TableRowItem({titleText, userDbValue}) {
    return (
      <TableRow
        className="data-table__accordion-row"
      >
        <TableCell component="th" scope="row">{titleText}</TableCell>
        <TableCell align="right">{userDbValue}</TableCell>
      </TableRow>
    )
  }



  return (

    <main className="main data-table">
      <div className="data-table__container container">

        <ButtonNavigateToTravelAgencies route="back" />

        <div className="data-table__body">
          {
            usersDb.map((userDb, index) => (
              <Accordion className="data-table__accordion" key={index}>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  className="data-table__accordion-title"
                >
                  <Typography component="span">{userDb.trade_name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 350 }} aria-label="simple table">
                      <TableBody>

                        <TableRowItem titleText="Юридическое название" userDbValue={userDb.legal_name}/>
                        <TableRowItem titleText="ИНН" userDbValue={userDb.inn}/>
                        <TableRowItem titleText="КПП" userDbValue={userDb.kpp}/>
                        <TableRowItem titleText="Юридический адрес" userDbValue={userDb.legal_address}/>
                        <TableRowItem titleText="Фактический адрес" userDbValue={userDb.actual_address}/>
                        <TableRowItem titleText="Номер расчётного счёта в банке" userDbValue={userDb.bank_account_number}/>
                        <TableRowItem titleText="Корреспонденский счёт в банке" userDbValue={userDb.correspondent_account_number}/>
                        <TableRowItem titleText="БИК банка" userDbValue={userDb.bank_bik}/>
                        <TableRowItem titleText="Наименование и адрес местонахождения банка" userDbValue={userDb.bank_name_and_location}/>
                        <TableRowItem titleText="Ген.директор Турагентства" userDbValue={userDb.ceo_name}/>
                        <TableRowItem titleText="Контактное лицо от Турагентства" userDbValue={userDb.contact_person_name}/>
                        <TableRowItem titleText="Телефон" userDbValue={userDb.phone}/>
                        <TableRowItem titleText="Почта" userDbValue={userDb.email}/>
                        <TableRowItem titleText="Адрес для отправки Корреспонденции" userDbValue={userDb.correspondence_address}/>
                        <TableRowItem titleText="Дата регистрации" userDbValue={userDb.date_of_registration}/>

                      </TableBody>
                    </Table>
                  </TableContainer>

                </AccordionDetails>
              </Accordion>
            ))
          }
        </div>


      </div>

    </main>

  );
}