import React, { useState } from "react";
import SelectAccountNameOwnerCredit from "./SelectAccountNameOwnerCredit";
import SelectAccountNameOwnerDebit from "./SelectAccountNameOwnerDebit";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SnackbarBaseline from "./SnackbarBaseline";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import useFetchPayment from "./queries/useFetchPayment";
import usePaymentInsert from "./queries/usePaymentInsert";
import usePaymentDelete from "./queries/usePaymentDelete";
import useFetchParameter from "./queries/useFetchParameter";
import Payment from "./model/Payment";
import Transaction from "./model/Transaction";

export default function PaymentTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const history = useNavigate();

  const { data, isSuccess } = useFetchPayment();
  const { data: parameterData, isSuccess: parameterSuccess } =
    useFetchParameter("payment_account");
  const { mutate: insertPayment } = usePaymentInsert();
  const { mutate: deletePayment } = usePaymentDelete();

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const handleButtonClickLink = (rowData: Transaction) => {
    history("/transactions/" + rowData.accountNameOwner);
  };

  const handleError = (error: any, moduleName: string, throwIt: any) => {
    if (error.response) {
      setMessage(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data,
        )}`,
      );
      console.log(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data,
        )}`,
      );
      setOpen(true);
    } else {
      setMessage(`${moduleName}: failure`);
      console.log(`${moduleName}: failure`);
      setOpen(true);
      if (throwIt) {
        throw error;
      }
    }
  };

  const addRow = (newData: Payment) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await insertPayment({ payload: newData });
          resolve("success");
        } catch (error) {
          handleError(error, "addRow", false);
          reject();
        }
      }, 1000);
    });
  };

  const columns: GridColDef[] = [
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      type: "date",
      width: 180,
      valueGetter: (params: any) => new Date(params.value),
      renderCell: (params) => moment(params.value).format("YYYY-MM-DD"),
      editable: true,
      renderEditCell: (params: any) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            value={params.value || null}
            onChange={(newValue: any) =>
              params.api
                .getCellEditorInstances()
                .forEach((editor: any) => editor.setValue(newValue))
            }
            slots={{ textField: TextField }}
          />
        </LocalizationProvider>
      ),
    },
    {
      field: "accountNameOwner",
      headerName: "Account Name Owner",
      width: 180,
      renderCell: (params) => (
        <Button
          style={{ fontSize: ".6rem" }}
          onClick={() => handleButtonClickLink(params.row)}
        >
          {params.row.accountNameOwner}
        </Button>
      ),
      renderEditCell: (params) => (
        <SelectAccountNameOwnerCredit
          onChangeFunction={params.onChange}
          currentValue={params.value}
        />
      ),
      cellClassName: "nowrap",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 150,
      valueFormatter: (params: any) =>
        params.value
          ? params.value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          : "",
      editable: true,
      cellClassName: "nowrap",
    },

    // {
    //   field: "sourceAccount",
    //   headerName: "Source Account",
    //   width: 180,
    //   editable: true,
    //   renderEditCell: (params: any) => (
    //     <SelectAccountNameOwnerDebit
    //       onChangeFunction={(value: any) =>
    //         params.api
    //           .getCellEditorInstances()
    //           .forEach((editor: any) => editor.setValue(value))
    //       }
    //       currentValue={params.value || ""}
    //     />
    //   ),
    // },
    // {
    //   field: "destinationAccount",
    //   headerName: "Destination Account",
    //   width: 200,
    //   editable: true,
    //   renderEditCell: (params: any) => (
    //     <SelectAccountNameOwnerCredit
    //       onChangeFunction={(value: any) =>
    //         params.api
    //           .getCellEditorInstances()
    //           .forEach((editor: any) => editor.setValue(value))
    //       }
    //       currentValue={params.value || ""}
    //     />
    //   ),
    // },
  ];

  return (
    <div>
      {isSuccess && parameterSuccess ? (
        <div data-testid="payment-table">
          <DataGrid
            data-testid="payment-material-table"
            columns={columns}
            rows={data}
            //pagination
            checkboxSelection
            getRowId={(row:any) => row.paymentId}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#9965f4",
                color: "#FFFFFF",
              },
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
          <Spinner data-test-id="payments-spinner" />
        </div>
      )}
    </div>
  );
}
