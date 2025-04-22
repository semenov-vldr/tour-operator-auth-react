import * as React from 'react';
import { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, Snackbar } from '@mui/material';

import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, update } from "firebase/database";
import reverseDate from "../../hooks/reverseDate.js";

import { db, auth } from "../../../firebase.js";
import "./ButtonCreate.sass";
import AddIcon from "../../icons/add.svg";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

import { namesOfExcursions, numberOfPeople, budget, food, typeOfAccommodation } from "./answer_options.js";






const ButtonCreate = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);


  // Используем useEffect и onAuthStateChanged для отслеживания состояния аутентификации и получения userId при входе пользователя в систему
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, [auth, setUserId]);


  function SimpleAlert() {
    return (
      <Alert className="alert-success" icon={<CheckIcon fontSize="inherit" />} severity="success" onClose={() => setShowAlert(false)}>
        Ваша заявка на тур успешно создана и отправлена. Менеджер SPB Travel Group с вами свяжется.
      </Alert>
    );
  }


  function AutohideSnackbar() {
    const handleClose = (evt, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowAlert(false);
    };

    const text = "Ваша заявка на тур успешно создана и отправлена. Менеджер SPB Travel Group с вами свяжется.";

    return (
      <div>
        <Snackbar open={showAlert} autoHideDuration={5000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {text}
          </Alert>
        </Snackbar>
      </div>
    )
  };


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const tourConfig = {
    name: "",
    number_of_people: "",
    date_start: "",
    date_end: "",
    food: "",                   // Питание
    type_of_accommodation: "",  // Тип проживания
    budget: "",
    comment: "",
    status: "new",
    date_creation: reverseDate(new Date().toJSON().slice(0, 10)),
  };


  const [optionTour, setOptionTour] = useState(tourConfig);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'date_start' || name === 'date_end') {
      processedValue = reverseDate(value);
    }
    setOptionTour((prevUser) => ({ ...prevUser, [name]: processedValue }));
  };

  const TourFormSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Вы не авторизованы.');
      return;
    }

    try {
      // Создаем новый ключ для тура
      const newTourKey = push(ref(db, `users/${userId}/tours`)).key;

      // Формируем объект данных тура
      const tourData = {
        ...optionTour,
        tourId: newTourKey,
        userId: userId
      };

      // Удаляем незаполненные поля в БД
      Object.keys(tourData).forEach(key => tourData[key] === "" ? delete tourData[key] : {});

      // Обновляем данные в Firebase
      const updates = {};
      updates[`/users/${userId}/tours/${newTourKey}`] = tourData;
      await update(ref(db), updates);

      console.log('Данные тура успешно отправлены в Firebase');
      setOptionTour(tourConfig);
      handleClose();
      setShowAlert(true);

    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      alert('Произошла ошибка при отправке заявки.');
    }
  };


  return (
  <>
    <button className="button-create" onClick={handleClickOpen}>
      Новая заявка
      <img className="button-create__icon" src={AddIcon} />
    </button>
    {showAlert && <AutohideSnackbar />}
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <Box component="form" onSubmit={TourFormSubmit} autoComplete="off">
      <DialogTitle>Выберите параметры тура/экскурсии</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <Box
          className="form-popup"
          component="form"
          noValidate
          autoComplete="off"
          sx={{mt: 5}}
        >
          {/*---------- Направление ----------*/}
        <TextField
          select
          name="name"
          label="Укажите город поездки"
          onChange={handleChange}
          fullWidth
          required
        >
          {namesOfExcursions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

          {/*Даты*/}
        <div className="dates">
          <div
            className="dates__item">
            <InputLabel>
              Дата начала поездки
            </InputLabel>
            <TextField
              type="date"
              name="date_start"
              onChange={handleChange}
              required
            />
          </div>

          <div
            className="dates__item">
            <InputLabel>
              Дата окончания поездки
            </InputLabel>
            <TextField
              type="date"
              name="date_end"
              onChange={handleChange}
              required
            />
          </div>

        </div>

          {/*---------- Количество человек ----------*/}
          <TextField
            select
            name="number_of_people"
            label="Планируемое количество человек"
            onChange={handleChange}
            fullWidth
            required
          >
            {numberOfPeople.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/*---------- Тип питания ----------*/}
          <TextField
            select
            name="food"
            label="Питание"
            onChange={handleChange}
            fullWidth
            required
          >
            {food.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/*---------- Тип проживания ----------*/}
          <TextField
            select
            name="type_of_accommodation"
            label="Проживание"
            onChange={handleChange}
            fullWidth
            required
          >
            {typeOfAccommodation.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>


          {/*---------- Бюджет ----------*/}
          <TextField
            select
            name="budget"
            label="Ваш бюджет на человека"
            onChange={handleChange}
            fullWidth
            required
          >
            {budget.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            multiline
            label="Коментарии"
            variant="outlined"
            name="comment"
            rows={3}
            onChange={handleChange}
            required
          />

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button type="submit">Отправить</Button>
      </DialogActions>
        </Box>
    </Dialog>
  </>

  );

};

export default ButtonCreate;