import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


export default function AlertDialog({ isOpen, onClose, onConfirm, text }) {

  const handleCancel = () => onClose && onClose();
  const handleConfirm = () => onConfirm && onConfirm();


  return (
      <Dialog
        open={isOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {text}
        </DialogTitle>
        {/*<DialogContent>*/}
        {/*  <DialogContentText id="alert-dialog-description">*/}
        {/*    Let Google help apps determine location. This means sending anonymous*/}
        {/*    location data to Google, even when no apps are running.*/}
        {/*  </DialogContentText>*/}
        {/*</DialogContent>*/}
        <DialogActions>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button onClick={handleConfirm} autoFocus>Подтвердить</Button>
        </DialogActions>
      </Dialog>
  );
}