import React, { useState, useEffect } from "react";

// MUI react component
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// MUI icon
import CloseIcon from "@mui/icons-material/Close";

interface iDialogTokenProps {
  ica_token: string;
  setToken(token: string): void;
}

interface IDialogTokenProps {
  handleIcaTokenChange: Function;
}

export default function DialogTokenForm(props: IDialogTokenProps) {
  const [icaJwtToken, setIcaJwtToken] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  const { handleIcaTokenChange } = props;

  function handleSaveButton() {
    handleIcaTokenChange(icaJwtToken);
  }

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <Button onClick={handleClose} sx={{ position: "absolute", right: 0 }}>
          <CloseIcon color="disabled" />
        </Button>
        <DialogTitle>ICA JWT token</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Copy and paste ICA JWT token for ICA API.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="ica_jwt"
            label="ICA JWT"
            fullWidth
            variant="standard"
            value={icaJwtToken}
            onChange={(e) => setIcaJwtToken(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveButton}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
