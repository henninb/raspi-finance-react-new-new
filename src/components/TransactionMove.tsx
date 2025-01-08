import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SnackbarBaseline from "./SnackbarBaseline";
import useFetchAccount from "./queries/useFetchAccount";
import useTransactionUpdate from "./queries/useTransactionUpdate";
import Transaction from "./model/Transaction";

interface Props {
  closeDialog: any;
  currentTransaction: any;
}

export default function TransactionMove({
  closeDialog,
  currentTransaction,
}: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [accountTypeState, setAccountTypeState] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { data, isSuccess } = useFetchAccount();
  const { mutate: updateTransaction } = useTransactionUpdate();

  const handleError = (error: any, moduleName: string, throwIt: boolean) => {
    if (error.response) {
      setMessage(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data,
        )}`,
      );
      console.error(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data,
        )}`,
      );
      setOpen(true);
    } else {
      setMessage(`${moduleName}: failure`);
      console.error(`${moduleName}: failure`);
      setOpen(true);
      if (throwIt) {
        throw error;
      }
    }
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const handleButtonClick = useCallback(
    async (currentTransaction: Transaction) => {
      try {
        const newTransaction: Transaction = { ...currentTransaction };
        newTransaction.accountNameOwner = value ?? ""; // Use empty string if value is null
        updateTransaction({
          oldRow: currentTransaction,
          newRow: newTransaction,
        });
        closeDialog();
      } catch (error) {
        handleError(error, "updateAccountByGuid", true);
      }
    },
    [value, updateTransaction, closeDialog],
  );

  useEffect(() => {
    if (isSuccess) {
      setAccountTypeState(currentTransaction.accountType);

      const accounts = data
        .filter(({ accountType }: any) => accountType === accountTypeState)
        .map(({ accountNameOwner }: any) => accountNameOwner);

      setOptions(accounts);
    }
  }, [accountTypeState, currentTransaction, data, isSuccess]);

  return (
    <div>
      <Button variant="outlined" onClick={closeDialog}>
        Open form dialog
      </Button>
      <Dialog
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
        open={true}
      >
        <DialogTitle id="form-dialog-title">
          Move a transaction from one account to another
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new account {currentTransaction.guid} is moving to.
          </DialogContentText>
          <Autocomplete
            value={value}
            onChange={(_event, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={options}
            renderInput={(params) => (
              <TextField {...params} label="Accounts" variant="outlined" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={() => handleButtonClick(currentTransaction)}
            variant="contained"
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarBaseline
        message={message}
        state={open}
        handleSnackbarClose={handleSnackbarClose}
      />
    </div>
  );
}
