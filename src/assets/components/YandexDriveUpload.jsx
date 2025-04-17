import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const token = "y0__xCYtPUGGNuWAyCNzKrtEue3WMzrz30qDYbI1DhSasqfKHrs"; // Получаем токен из .env

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedFileLink(null); // Сброс ссылки при выборе нового файла
    setUploadError(null);      // Сброс ошибки
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, выберите файл.');
      return;
    }

    if (!token) {
      alert('Токен доступа к Яндекс.Диску не найден. Убедитесь, что он установлен в .env');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadedFileLink(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('path', `/programs/${selectedFile.name}`); //  Указываем путь для сохранения (в корень, с именем файла)

    try {
      // 1. Получаем ссылку для загрузки (upload URL)
      const uploadUrlResponse = await axios.get(
        'https://cloud-api.yandex.net/v1/disk/resources/upload',
        {
          params: {
            path: `/programs/${selectedFile.name}`, // Путь, куда мы хотим загрузить файл
            overwrite: 'true', // Перезаписывать файл, если он уже существует
          },
          headers: {
            Authorization: `OAuth ${token}`,
          },
        }
      );

      const uploadUrl = uploadUrlResponse.data.href; // URL для загрузки файла

      // 2. Загружаем файл (PUT запрос)
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type, // Устанавливаем Content-Type
        },
        onUploadProgress: (progressEvent) => {
          // Можно добавить логику для отображения прогресса загрузки
          //console.log('Загружено', progressEvent.loaded, 'из', progressEvent.total);
        },
      });

      // 3. Получаем информацию о файле, чтобы взять ссылку
      const fileInfoResponse = await axios.get(
        `https://cloud-api.yandex.net/v1/disk/resources?path=/programs/${selectedFile.name}`,
        {
          headers: {
            Authorization: `OAuth ${token}`,
          },
        }
      );

      console.log(fileInfoResponse)

      const publicUrl = fileInfoResponse.data.file;

      setUploadedFileLink(publicUrl);
      console.log('Ссылка на файл:', publicUrl); //  Выводим ссылку в консоль
      // Тут можно добавить код для сохранения ссылки в другую БД
    } catch (error) {
      setUploadError(error.message || 'Произошла ошибка при загрузке файла.');
      console.error('Ошибка загрузки файла:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Загрузка файла в Яндекс.Диск</h2>
      <input
        type="file"
        onChange={handleFileChange}
        name="file"
        accept=".pdf"
      />
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
      {uploadError && <p style={{ color: 'red' }}>Ошибка: {uploadError}</p>}
    </div>
  );
}

export default FileUpload;
