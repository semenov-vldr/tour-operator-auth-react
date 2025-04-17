import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker'

const GoogleDrivePicker = () => {

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId: "425328990391-lbtavo3v4fhp1odg8gk6ralibq23797j.apps.googleusercontent.com",
      developerKey: "AIzaSyDTOKorK0gYHEagyK82T26859BAauu3tjI",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)
      },
    })
  }

  return (
    <div>

      <button onClick={() => handleOpenPicker()}>Open Picker</button>

    </div>
  );
};

export default GoogleDrivePicker;