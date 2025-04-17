import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useRef } from "react";

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import { ref as dbRef, update, remove } from "firebase/database";
import { db, storage } from "../../../firebase.js";



const UploadFile = ({ tour, userId, onUpdate }) => {

  // Загруженный файл к заявке тура (pdf-программа)
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(tour.pdfURL || null); // Use tour.pdfURL if available

  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select"); // "select" | "uploading" | "done"

  const handleFileUpload = (evt) => {
    const file = evt.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert("Пожалуйста, выберите PDF файл");
      return;
    }
    setSelectedFile(file);
    console.log(file)

  };

  const submitFile = async (evt) => {
    evt.preventDefault();
    const file = selectedFile;
    console.log(file)

    try {
      const storageRef = ref(storage, `programs/${tour.tourId}/${file.name}`); // Use tourId in path
      const uploadResult = await uploadBytes(storageRef, file);

      // Получаем URL для скачивания файла
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Обновляем URL в Realtime Database
      const tourRef = dbRef(db, `users/${userId}/tours/${tour.tourId}`); // Use tourId in path
      await update(tourRef, { pdfURL: downloadURL });

      setDownloadURL(downloadURL);
      if (onUpdate) onUpdate(); // Call onUpdate to refresh the tours list

      alert("Файл успешно загружен");
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert('Произошла ошибка при загрузке файла.');
    } finally {
      setSelectedFile(null);
    }
  }



  // Очистка файла из input
  const clearFile = () => setSelectedFile(null);



  return (
    <form
      onSubmit={submitFile}
      className="userPage__card-form">



    <div className="userPage__card-upload">
      <label className="button button-success">

        {/*<CircularProgress size={24} color="#fff" />*/}

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
          onChange={handleFileUpload}
          name="file"
          accept=".pdf"
        />

      </label>

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
          type="submit"
          className="userPage__card-upload-send-file button button-send-file"
          title="Отправить файл в базу данных"
        >
          <span>Отправить</span>
          <SendRoundedIcon sx={{fontSize: 24}} />
        </button>
      }

    </form>
  );
};

export default UploadFile;