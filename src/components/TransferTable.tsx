import React, { useState, useEffect } from "react";
import SelectAccountNameOwnerDebit from "./SelectAccountNameOwnerDebit";
import Spinner from "./Spinner";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SnackbarBaseline from "./SnackbarBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import useFetchTransfer from "./queries/useFetchTransfer";
import useTransferInsert from "./queries/useTransferInsert";
import useTransferDelete from "./queries/useTransferDelete";
import Transfer from "./model/Transfer";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';

export default function TransferTable() {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState(true);

  const { data, isSuccess } = useFetchTransfer();
  const { mutate: insertTransfer } = useTransferInsert();
  const { mutate: deleteTransfer } = useTransferDelete();

  useEffect(() => {
    if (isSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess]);

  const dataTest = [
    {
        "transferId": 9,
        "sourceAccount": "barclays-savings_brian",
        "destinationAccount": "wellsfargo-savings_kari",
        "transactionDate": "2025-01-04",
        "amount": 3.00,
        "guidSource": "00a8a750-cc3d-4c24-9263-c85af59cab64",
        "guidDestination": "00a8a750-cc3d-4c24-9263-c85af59cab64",
        "activeStatus": true
    },
    {
        "transferId": 10,
        "sourceAccount": "barclays-savings_brian",
        "destinationAccount": "wellsfargo-savings_kari",
        "transactionDate": "2025-01-04",
        "amount": 2.00,
        "guidSource": "00a8a750-cc3d-4c24-9263-c85af59cab64",
        "guidDestination": "00a8a750-cc3d-4c24-9263-c85af59cab64",
        "activeStatus": true
    }
  ];

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
        sourceAccount: newData.sourceAccount || "",
        destinationAccount: newData.destinationAccount || "",
      };
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
        const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
        //console.log("localDate: " + localDate);
        return localDate;
      },
      editable: true,
      // renderEditCell: (params: any) => (
      //   <LocalizationProvider dateAdapter={AdapterMoment}>
      //     <DatePicker
      //       value={params.value || null}
      //       onChange={(newValue: any) =>
      //         params.api
      //           .getCellEditorInstances()
      //           .forEach((editor: any) => editor.setValue(newValue))
      //       }
      //       slots={{ textField: TextField }}
      //     />
      //   </LocalizationProvider>
      // ),
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
      headerName: "",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <div>
        <IconButton       
          onClick={() => {
            handleDeleteRow(params.row)
          }
          }
        >
          <DeleteIcon />
        </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
       <h2>Transfer Details</h2>
      { !showSpinner ? (
        <div data-testid="transfer-table">
            <IconButton 
              //onClick={handleAddRow} 
              style={{ marginLeft: 8 }}>
              <AddIcon />
            </IconButton>
          <DataGrid
            columns={columns}
            rows={data}
            //autoPageSize
            //checkboxSelection
            getRowId={(row: Transfer) => row.transferId}
            // sx={{
            //   "& .MuiDataGrid-columnHeaders": {
            //     backgroundColor: "#9965f4",
            //     color: "#FFFFFF",
            //   },
            // }}
          />
        </div>
      ) : (
        <div className="centered">
          <Spinner data-test-id="transfers-spinner" />
        </div>
      )}
    </div>
  );
}
