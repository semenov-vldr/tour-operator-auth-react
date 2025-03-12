import { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputMask from 'react-input-mask';
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import useAuth from "../assets/hooks/useAuth.js";
import { getSession } from "../session";
import Header from "../assets/components/Header/Header";


const UserForm = () => {
  const ADMIN_EMAIL = "admin@mail.ru";

  const userId = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    let session = getSession();
    setEmail(session.email);
  }, [ navigate]);


  const userConfig = {
    legal_name: "",                   // Юридическое название
    trade_name: "",                   // Торговое наименование
    inn: "",                          // ИНН
    kpp: "",                          // КПП
    legal_address: "",                // Юридический адрес
    actual_address: "",               // Фактический адрес
    bank_account_number: "",          // Номер расчётного счёта в банке
    correspondent_account_number: "", // Корреспонденский счёт в банке
    bank_bik: "",                     // БИК банка
    bank_name_and_location: "",       // Наименование и адрес местонахождения банка
    ceo_name: "",                     // Ген.директор Турагентства
    contact_person_name: "",          // Контактное лицо от Турагентства
    phone: "",                        // Телефон
    email: "",                        // Почта
    correspondence_address: "",       // Адрес для отправки Корреспонденции
    admin: false,
    date_of_registration: new Date().toJSON().slice(0, 10),
  }

  const [user, setUser] = useState(userConfig);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAdmin = email === ADMIN_EMAIL;
    const userWithEmail = { ...user, email: email, admin: isAdmin };

    try {
      const updates = {};
      updates[`/users/${userId}`] = userWithEmail;
      console.log("Данные успешно отправлены в Firebase");
      await update(ref(db), updates);

      setUser(userConfig);
      navigate("/user");

    } catch (error) {
      console.error("Ошибка отправки данных:", error);
    }
  };


  return (
    <>
    <Header />
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Данные вашей компании:
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>

        <TextField
          label="Юридическое название"
          name="legal_name"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.legal_name}
          onChange={handleChange}
          autocomplete="organization"
          required
        />

        <TextField
          label="Торговое наименование"
          name="trade_name"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.trade_name}
          onChange={handleChange}
          autoComplete="off"

        />

        <InputMask
          mask="9999999999"
          value={user.inn}
          onChange={handleChange}
        >
          {() =>
            <TextField
              label="ИНН"
              name="inn"
              variant="outlined"
              sx={{ mt: 3 }}
              fullWidth
              autoComplete="off"

            />}
        </InputMask>

        <InputMask
          mask="999999999"
          value={user.kpp}
          onChange={handleChange}
        >
          {() =>
            <TextField
              label="КПП"
              name="kpp"
              variant="outlined"
              sx={{ mt: 3 }}
              fullWidth
              autoComplete="off"

            />
          }
        </InputMask>

        <TextField
          label="Юридический адрес"
          name="legal_address"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.legal_address}
          onChange={handleChange}
          autoComplete="off"

        />

        <TextField
          label="Фактический адрес"
          name="actual_address"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.actual_address}
          onChange={handleChange}
          autoComplete="off"

        />

        <InputMask
          mask="99999999999999999999"
          value={user.bank_account_number}
          onChange={handleChange}
        >
          {() =>
            <TextField
              label="Номер расчётного счёта в банке"
              name="bank_account_number"
              variant="outlined"
              sx={{ mt: 3 }}
              fullWidth
              autocomplete="cc-number"

            />}
        </InputMask>

        <InputMask
          mask="99999999999999999999"
          value={user.correspondent_account_number}
          onChange={handleChange}
        >
          {() =>
            <TextField
              label="Корреспонденский счёт в банке"
              name="correspondent_account_number"
              variant="outlined"
              sx={{ mt: 3 }}
              fullWidth
              autoComplete="off"

            />}
        </InputMask>

        <InputMask
          mask="999999999"
          value={user.bank_bik}
          onChange={handleChange}
        >
          {() =>
            <TextField
              label="БИК банка"
              name="bank_bik"
              variant="outlined"
              sx={{ mt: 3 }}
              fullWidth
              onChange={handleChange}
              autoComplete="off"

            />}
        </InputMask>

        <TextField
          label="Наименование и адрес местонахождения банка"
          name="bank_name_and_location"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.bank_name_and_location}
          onChange={handleChange}
          autoComplete="off"

        />

        <TextField
          label="Ген.директор Турагентства"
          name="ceo_name"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.ceo_name}
          onChange={handleChange}
          autocomplete="name"

        />

        <TextField
          label="Контактное лицо от Турагентства"
          name="contact_person_name"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.contact_person_name}
          onChange={handleChange}
          autocomplete="name"

        />

        <InputMask
          mask="+7 (999) 999-99-99"
          value={user.phone}
          onChange={handleChange}
        >
          {() =>
            <TextField
              label="Номер телефона"
              name="phone"
              type="tel"
              variant="outlined"
              sx={{ mt: 3 }}
              fullWidth
              autoComplete="off"

            />
          }
        </InputMask>

        <TextField
          label="Адрес для отправки Корреспонденции"
          name="correspondence_address"
          variant="outlined"
          sx={{ mt: 3 }}
          fullWidth
          value={user.correspondence_address}
          onChange={handleChange}
          autoComplete="off"
        />

        <Button size="large" variant="contained" type="submit" sx={{ mt: 3 }} fullWidth>Отправить</Button>
      </Box>

    </Container>
    </>
  );
};

export default UserForm;