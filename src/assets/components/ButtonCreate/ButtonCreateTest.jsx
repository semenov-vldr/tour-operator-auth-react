import * as React from 'react';
import { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel } from '@mui/material';

import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, update } from "firebase/database";

import { db, auth } from "../../../firebase.js";
import "./ButtonCreate.sass";
import AddIcon from "../../icons/add.svg";

import { namesOfExcursions, numberOfPeople, budget, food, typeOfAccommodation } from "./answer_options.js";



const ButtonCreateTest = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);


  // Используем useEffect и onAuthStateChanged для отслеживания состояния аутентификации и получения userId при входе пользователя в систему
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, [auth, setUserId]);



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
    status: "",              // Одобрена/Не одобрена заявка админом
  };


  const [optionTour, setOptionTour] = useState(tourConfig);

  const reverseDate = (date) => {
    if (!date) return "";
    const parts = date.split('-');
    if (parts.length !== 3) return "Ошибка даты";
    return parts.reverse().join('-');
  };


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
      };

      // Обновляем данные в Firebase
      const updates = {};
      updates[`/users/${userId}/tours/${newTourKey}`] = tourData;
      await update(ref(db), updates);

      console.log('Данные тура успешно отправлены в Firebase');
      setOptionTour(tourConfig);
      handleClose();
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

export default ButtonCreateTest;