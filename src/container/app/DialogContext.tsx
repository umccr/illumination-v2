import React, { useContext, createContext, useState } from "react";

// mui- components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface IDialogShowProps {
  children?: React.ReactNode;
}

export const dialogContex = {
  dialogInfo: {
    isOpen: false,
    dialogTitle: "",
    dialogContent: "",
  },
  setDialogInfo: (dialoasdg: any) => {},
};

export default function DialogComponent(props: IDialogShowProps) {
  const [dialogInfo, setDialogInfo] = useState(dialogContex.dialogInfo);

  // Reset Dialog when Close
  const handleClose = () =>
    setDialogInfo({
      isOpen: false,
      dialogTitle: "",
      dialogContent: "",
    });

  return (
    <>
      <Dialog open={dialogInfo.isOpen} onClose={handleClose}>
        <DialogTitle>{dialogInfo.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogInfo.dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render The rest of the Component */}
      <DialogContext.Provider value={{ dialogInfo, setDialogInfo }}>
        {props.children}
      </DialogContext.Provider>
    </>
  );
}


// Context to store logged in user information
export const DialogContext = createContext(dialogContex);
export function useDialogContext() {
  return useContext(DialogContext);
}