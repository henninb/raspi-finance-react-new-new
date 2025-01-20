import React, { useState, useEffect } from "react";
import SelectAccountNameOwnerDebit from "./SelectAccountNameOwnerDebit";
import Spinner from "./Spinner";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SnackbarBaseline from "./SnackbarBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import useFetchTransfer from "./queries/useFetchTransfer";
import useTransferInsert from "./queries/useTransferInsert";
import useTransferDelete from "./queries/useTransferDelete";
import Transfer from "./model/Transfer";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";

export default function TransferTable() {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [openForm, setOpenForm] = useState<boolean>(false); // State to control the form overlay
  const [transferData, setTransferData] = useState<Transfer | null>(null); // State to store the data being edited

  const { data, isSuccess } = useFetchTransfer();
  const { mutate: insertTransfer } = useTransferInsert();
  const { mutate: deleteTransfer } = useTransferDelete();

  useEffect(() => {
    if (isSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess]);

  const handleSnackbarClose = () => setOpen(false);

  const handleDeleteRow = async (transfer: Transfer) => {
    await deleteTransfer({ oldRow: transfer });
  };

  const handleError = (error: any, moduleName: string, throwIt: boolean) => {
    const errorMsg =
      error.response?.data || `${moduleName}: failure - ${error.message}`;
    setMessage(`${moduleName}: ${errorMsg}`);
    console.error(`${moduleName}:`, error);
    setOpen(true);

    if (throwIt) throw error;
  };

  const addRow = async (newData: Transfer): Promise<string> => {
    try {
      const transferData = {
        ...newData,
        //sourceAccount: newData.sourceAccount || "",
        //destinationAccount: newData.destinationAccount || "",
        // TODO: bh for testing purposes, need to remove them 1/10/2025
        guidSource: "00a8a750-cc3d-4c24-9263-c85af59cab64",
        guidDestination: "00a8a750-cc3d-4c24-9263-c85af59cab64",
        activeStatus: true,
      };
      console.log("transferData: " + JSON.stringify(transferData));
      await insertTransfer({ payload: transferData });
      return "success";
    } catch (error) {
      handleError(error, "addRow", false);
      throw error;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      type: "date",
      width: 180,
      renderCell: (params) => {
        return params.value.toLocaleDateString("en-US");
      },
      valueGetter: (params: string) => {
        //console.log("date-in:" + params)
        const utcDate = new Date(params);
        const localDate = new Date(
          utcDate.getTime() + utcDate.getTimezoneOffset() * 60000,
        );
        //console.log("localDate: " + localDate);
        return localDate;
      },
      editable: true,
    },
    {
      field: "sourceAccount",
      headerName: "Source Account",
      width: 180,
      editable: true,
      renderEditCell: (params: any) => (
        <SelectAccountNameOwnerDebit
          onChangeFunction={(value: any) =>
            params.api
              .getCellEditorInstances()
              .forEach((editor: any) => editor.setValue(value))
          }
          currentValue={params.value || ""}
        />
      ),
    },
    {
      field: "destinationAccount",
      headerName: "Destination Account",
      width: 200,
      editable: true,
      renderEditCell: (params: any) => (
        <SelectAccountNameOwnerDebit
          onChangeFunction={(value: any) =>
            params.api
              .getCellEditorInstances()
              .forEach((editor: any) => editor.setValue(value))
          }
          currentValue={params.value || ""}
        />
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 150,
      renderCell: (params: any) =>
        params.value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      editable: true,
      cellClassName: "nowrap",
    },
    {
      field: "",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => {
              handleDeleteRow(params.row);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // const handleAddRow = () => {
  //   return {
  //     transferId: Math.random(),
  //     sourceAccount: "",
  //     destinationAccount: "",
  //     transactionDate: new Date(),
  //     amount: 0.0,
  //     guidSource: "",
  //     guidDestination: "",
  //     activeStatus: true,
  //   };
  // };

  return (
    <div>
      <h2>Transfer Details</h2>
      {!showSpinner ? (
        <div data-testid="transfer-table">
          <IconButton
            onClick={() => {
              setOpenForm(true);
              //return handleAddRow
            }}
            style={{ marginLeft: 8 }}
          >
            <AddIcon />
          </IconButton>
          <DataGrid
            columns={columns}
            rows={data}
            //autoPageSize
            //checkboxSelection
            getRowId={(row: Transfer) => row.transferId}
            processRowUpdate={(newRow: any, oldRow: any) => {
              // Handle row update here
              console.log("Row updated:", newRow);
              return newRow; // Return the updated row
            }}
          />
          <div>
            <SnackbarBaseline
              message={message}
              state={open}
              handleSnackbarClose={handleSnackbarClose}
            />
          </div>
        </div>
      ) : (
        <div className="centered">
          <Spinner data-test-id="transfers-spinner" />
        </div>
      )}

      {/* Form Overlay for Adding/Editing Transfer */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        aria-labelledby="form-modal"
        aria-describedby="form-modal-description"
      >
        <Box
          sx={{
            width: 400,
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            top: "20%",
          }}
        >
          <h3>{transferData ? "Edit Transfer" : "Add New Transfer"}</h3>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Transaction Date"
              //value={transferData?.transactionDate || null}
              onChange={(newValue) =>
                setTransferData((prev: any) => ({
                  ...prev,
                  transactionDate: newValue,
                }))
              }
              //renderInput={(props: any) => <TextField {...props} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          <SelectAccountNameOwnerDebit
            onChangeFunction={(value: string) =>
              setTransferData((prev: any) => ({
                ...prev,
                sourceAccount: value,
              }))
            }
            currentValue={transferData?.sourceAccount || ""}
          />

          {/* <TextField
            label="Source Account"
            value={transferData?.sourceAccount || ""}
            onChange={(e) => setTransferData((prev: any) => ({ ...prev, sourceAccount: e.target.value }))}
            fullWidth
            margin="normal"
          /> */}

          <SelectAccountNameOwnerDebit
            onChangeFunction={(value: string) =>
              setTransferData((prev: any) => ({
                ...prev,
                destinationAccount: value,
              }))
            }
            currentValue={transferData?.destinationAccount || ""}
          />
          {/* <TextField
            label="Destination Account"
            value={transferData?.destinationAccount || ""}
            onChange={(e) => setTransferData((prev: any) => ({ ...prev, destinationAccount: e.target.value }))}
            fullWidth
            margin="normal"
          /> */}

          <TextField
            label="Amount"
            //value={transferData?.amount || ""}
            value={transferData?.amount ?? ""}
            //onChange={(e) => setTransferData((prev: any) => ({ ...prev, amount: e.target.value }))}
            onChange={(e) =>
              setTransferData((prev: any) => ({
                ...prev,
                amount: parseFloat(e.target.value) || 0, // Convert input to a number
              }))
            }
            fullWidth
            margin="normal"
            type="number"
            slotProps={{
              htmlInput: {
                step: "0.01", // Allow decimal inputs
              },
            }}
          />

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => transferData && addRow(transferData)}
              style={{ marginTop: 16 }}
            >
              {transferData ? "Update" : "Add"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenForm(false)}
              style={{ marginTop: 16, marginLeft: 8 }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
