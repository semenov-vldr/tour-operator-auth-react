import React, {useEffect, useState} from 'react';
import axios from 'axios';
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LinkIcon from '@mui/icons-material/Link';

import { ref, get, update, remove } from "firebase/database";
import {db} from "../../firebase.js";



function YandexDriveUpload( { addUrlDoc, tour } ) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [urlDocFromDb, setUrlDocFromDb] = useState("");
  const token = "y0__xCYtPUGGNuWAyCNzKrtEue3WMzrz30qDYbI1DhSasqfKHrs"; // Получаем токен из .env

  const pathPrograms = "/programs/";


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadedFileLink(null); // Сброс ссылки при выборе нового файла
    setUploadError(null);      // Сброс ошибки
  };

  async function checkUrlDoc(tour) {
    const tourRef = ref(db, `users/${tour.userId}/tours/${tour.tourId}`);

    try {
      const snapshot = await get(tourRef);
      if (snapshot.exists() && snapshot.hasChild('urlDoc')) {
        const existingUrlDoc = snapshot.child('urlDoc').val();
        console.log(existingUrlDoc);
        setUrlDocFromDb(existingUrlDoc);
      }
    } catch (error) {
      console.error('Ошибка при получении ссылки на документ:', error);
    }
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, выберите файл.');
      return;
    };

    if (!token) {
      alert('Токен доступа к Яндекс.Диску не найден. Убедитесь, что он установлен в .env');
      return;
    }


    setUploading(true);
    setUploadError(null);
    setUploadedFileLink(null);
    setProgress(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('path', `${pathPrograms}${selectedFile.name}`); //  Указываем путь для сохранения (в корень, с именем файла)

    try {
      // 1. Получаем ссылку для загрузки (upload URL)
      const uploadUrlResponse = await axios.get(
        'https://cloud-api.yandex.net/v1/disk/resources/upload',
        {
          params: {
            path: `${pathPrograms}${selectedFile.name}`, // Путь, куда мы хотим загрузить файл
            overwrite: 'true', // Перезаписывать файл, если он уже существует
          },
          headers: {Authorization: `OAuth ${token}`},
        }
      );

      const uploadUrl = uploadUrlResponse.data.href; // URL для загрузки файла

      // 2. Загружаем файл (PUT запрос)
      await axios.put(uploadUrl, selectedFile, {
        headers: {'Content-Type': selectedFile.type},
        onUploadProgress: (progressEvent) => {
          // Можно добавить логику для отображения прогресса загрузки
          //console.log('Загружено', progressEvent.loaded, 'из', progressEvent.total);
        },
      });

      // 3. Получаем информацию о файле, чтобы взять ссылку
      const fileInfoResponse = await axios.get(
        `https://cloud-api.yandex.net/v1/disk/resources?path=${pathPrograms}${selectedFile.name}`,
        {
          headers: {Authorization: `OAuth ${token}`},
        });

      // Получение ссылки на файл
      const publicUrl = fileInfoResponse.data.file;
      setUploadedFileLink(publicUrl);
      addUrlDoc(publicUrl);

    }

    catch (error) {
      setUploadError(error.message || 'Произошла ошибка при загрузке файла.');
      console.error('Ошибка загрузки файла:', error);
    } finally {
      setUploading(false);
      setProgress(false);
      setSelectedFile(null);
    }

  };

  checkUrlDoc(tour);


  // Очистка файла из input
  const clearFile = () => setSelectedFile(null);

  return (

  <div
    className="userPage__card-form">

    <div className="userPage__card-upload">

      {
        !urlDocFromDb ? (

          <label className="button button-success">

            {
                selectedFile ? (
                  <span className="userPage__card-upload-text">{selectedFile.name}</span>
                ) : (
                  <>
                    <DriveFolderUploadIcon />
                    <span className="userPage__card-upload-text">Добавить файл</span>
                  </>
                )
            }

            <input
              type="file"
              hidden
              onChange={handleFileChange}
              name="file"
              accept=".pdf"
            />

          </label>

        ) : (
          <a href={urlDocFromDb} target="_blank" className="button button-send-file userPage__card-upload-link">
            <LinkIcon />
            <span className="userPage__card-upload-text">Программа</span>
          </a>
        )
      }



      {
        selectedFile &&
        <button
          type="button"
          className="userPage__card-upload-delete button button-cancel"
          onClick={clearFile}
          title="Очистить"
        >
          <DeleteOutlineRoundedIcon sx={{fontSize: 30}} />
        </button>
      }
    </div>

    {
      selectedFile &&
      <button
        onClick={handleUpload}
        type="button"
        className="userPage__card-upload-send-file button button-send-file"
        title="Отправить файл в базу данных"
      >

        {
          progress ? (<span>Загрузка...</span>) : (
            <>
              <span>Отправить</span>
              <SendRoundedIcon sx={{fontSize: 24}} />
            </>
          )
        }

      </button>
    }

  </div>

  );
}

export default YandexDriveUpload;
