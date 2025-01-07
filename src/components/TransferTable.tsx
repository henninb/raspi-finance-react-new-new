import React, { useState } from "react";
import SelectAccountNameOwnerDebit from "./SelectAccountNameOwnerDebit";
import Spinner from "./Spinner";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SnackbarBaseline from "./SnackbarBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
import TextField from '@mui/material/TextField';
import useFetchTransfer from "./queries/useFetchTransfer";
import useTransferInsert from "./queries/useTransferInsert";
import useTransferDelete from "./queries/useTransferDelete";
import Transfer from "./model/Transfer";

export default function TransferTable() {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { data, isSuccess } = useFetchTransfer();
  const { mutate: insertTransfer } = useTransferInsert();
  const { mutate: deleteTransfer } = useTransferDelete();

  const handleSnackbarClose = () => setOpen(false);

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
    renderCell: (params) => moment(params.value).format("YYYY-MM-DD"),
    editable: true,
    renderEditCell: (params: any) => (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={params.value || null}
          onChange={(newValue: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(newValue))}
          slots={{ textField: TextField }}
        />
      </LocalizationProvider>
    ),
  },
  {
    field: "sourceAccount",
    headerName: "Source Account",
    width: 180,
    editable: true,
    renderEditCell: (params: any) => (
      <SelectAccountNameOwnerDebit
        onChangeFunction={(value: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(value))}
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
        onChangeFunction={(value: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(value))}
        currentValue={params.value || ""}
      />
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    width: 150,
    editable: true,
  },
];

  return (
    <div>
      {isSuccess ? (
        <div data-testid="transfer-table">
          <DataGrid
            columns={columns}
            rows={data}
            autoPageSize
            checkboxSelection
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#9965f4",
                color: "#FFFFFF",
              },
            }}
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
