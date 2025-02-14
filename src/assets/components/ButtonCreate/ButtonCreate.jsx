import * as React from 'react';
import {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';

import { ref, push, } from "firebase/database";
import { db } from "../../../firebase.js";

import "./ButtonCreate.sass"
import AddIcon from "../../icons/add.svg"


const namesOfExcursions = [
  {
    value: "Санкт-Петербург",
    label: "Санкт-Петербург"
  },
  {
    value: "Москва",
    label: "Москва"
  },
  {
    value: "Казань",
    label: "Казань"
  },
  {
    value: "Волгоград",
    label: "Волгоград"
  },
  {
    value: "Карелия",
    label: "Карелия"
  },
  {
    value: "Сочи",
    label: "КавМинВоды"
  },
  {
    value: "Калининград",
    label: "Калининград"
  },
  {
    value: "Тула",
    label: "Тула"
  },
  {
    value: "Золотое Кольцо России",
    label: "Золотое Кольцо России"
  },
  {
    value: "Мурманск",
    label: "Мурманск"
  },
  {
    value: "Великий Новгород",
    label: "Великий Новгород"
  },
  {
    value: "Нижний Новгород",
    label: "Нижний Новгород"
  },
  {
    value: "Беларусь",
    label: "Беларусь"
  },

];


const numberOfPeople = [
  {
    value: "10-15",
    label: "от 10 до 15 чел"
  },
  {
    value: "15-20",
    label: "от 15 до 20 чел"
  },
  {
    value: "20-30",
    label: "от 20 до 30 чел"
  },
  {
    value: "30-40",
    label: "от 30 до 40 чел"
  },
  {
    value: "40-50",
    label: "от 40 до 50 чел"
  },
  {
    value: "50 и более",
    label: "50 и более"
  },
];


const budget = [
  {
    value: "до 10 000 руб./чел.",
    label: "до 10 000 руб./чел."
  },
  {
    value: "от 10 000 - 15 000 руб./чел.",
    label: "от 10 000 - 15 000 руб./чел."
  },
  {
    value: "от 15 000 - 20 000 руб./чел.",
    label: "от 15 000 - 20 000 руб./чел."
  },
  {
    value: "от 20 000 - 30 000 руб./чел.",
    label: "от 20 000 - 30 000 руб./чел."
  }
];

const food = [
  {
    value: "BB - завтраки",
    label: "BB - завтраки"
  },
  {
    value: "HB - завтрак и обед/ужин",
    label: "HB - завтрак и обед/ужин"
  },
  {
    value: "FB - завтрак, обед и ужин",
    label: "FB - завтрак, обед и ужин"
  },
];

const typeOfAccommodation = [
  {
    value: "Хостел",
    label: "Хостел"
  },
  {
    value: "Отель 2*",
    label: "Отель 2*"
  },
  {
    value: "Отель 3*",
    label: "Отель 3*"
  },
  {
    value: "Отель 4*",
    label: "Отель 4*"
  },
  {
    value: "Отель 5*",
    label: "Отель 5*"
  },

];



const ButtonCreate = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const tourConfig = {
    name: "",
    number_of_people: "",
    date_start: "",
    date_end: "",
    number_of_days: 0,
    food: "",                   // Питание
    type_of_accommodation: "",  // Тип проживания
    budget: "",
    comment: "",
    status: false,              // Одобрена/Не одобрена заявка админом
  };


  const [optionTour, setOptionTour] = useState(tourConfig);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOptionTour((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const TourFormSubmit = async (e) => {
    e.preventDefault();

    const usersRef = ref(db, "users/tours");

    const user = { ...optionTour };

    try {
      const newElementRef = await push(usersRef, user);
      console.log(newElementRef.key);
      console.log("Данные тура успешно отправлены в Firebase");
      setOptionTour(tourConfig);

    } catch (error) {
      console.error("Ошибка отправки данных:", error);
    }
    handleClose();
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

export default ButtonCreate;