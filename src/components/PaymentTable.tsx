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
import { GridValueFormatter } from '@mui/x-data-grid';

export default function PaymentTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const history = useNavigate();

  const dataTest = [    {
    "paymentId": 2593,
    "accountNameOwner": "rcard_brian",
    "transactionDate": "2024-09-24",
    "amount": 1.00,
    "guidSource": "90bea775-5b25-40f2-bc30-ca95a8083c1c",
    "guidDestination": "4fde7725-1960-42ca-87c0-204040429e6a",
    "activeStatus": true
},
{
    "paymentId": 2595,
    "accountNameOwner": "wellsfargo-cash_brian",
    "transactionDate": "2024-09-24",
    "amount": 1.00,
    "guidSource": "feb5fd7f-ca40-4faa-a031-c5fa4f0c02a5",
    "guidDestination": "c01495ae-46a6-45c1-8de1-6afaebb18673",
    "activeStatus": true
}]

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
      //type: "string",
      width: 180,
      valueGetter: (params: any) => new Date(params.value),
      renderCell: (params) => "2025-01-08",
      // editable: true,
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
    // {
    //   field: "accountNameOwner",
    //   headerName: "Account Name Owner",
    //   width: 180,
    //   renderCell: (params) => (
    //     <Button
    //       style={{ fontSize: ".6rem" }}
    //       onClick={() => handleButtonClickLink(params.row)}
    //     >
    //       {params.row.accountNameOwner}
    //     </Button>
    //   ),
    //   renderEditCell: (params) => (
    //     <SelectAccountNameOwnerCredit
    //       onChangeFunction={params.onChange}
    //       currentValue={params.value}
    //     />
    //   ),
    //   cellClassName: "nowrap",
    // },
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
      // valueFormatter: (params: any) => {
      //     console.log("param-value:" + params.value);
      //     params.value?.toLocaleString("en-US", {
      //         style: "currency",
      //         currency: "USD",
      //       })
      // },
      editable: true,
      cellClassName: "nowrap",
    },
    {
      field: "sourceAccount",
      headerName: "Source Account",
      width: 180,
      editable: true,
      //renderCell: parameterData?.parameterValue || "none",
      //renderCell: "amazing",
      // valueFormatter: (params: any) => {
      //   parameterData.parameterValue
      // },
      renderEditCell: (params: any) => (
        <SelectAccountNameOwnerDebit
          onChangeFunction={(value: any) =>
            params.api
              .getCellEditorInstances()
              .forEach((editor: any) => editor.setValue(parameterData.parameterValue))
          }
          currentValue={params.value || ""}
        />
      ),
    },
    {
      field: "accountNameOwner",
      headerName: "Destination Account",
      width: 200,
      editable: true,
      renderEditCell: (params: any) => (
        <SelectAccountNameOwnerCredit
          onChangeFunction={(value: any) =>
            params.api
              .getCellEditorInstances()
              .forEach((editor: any) => editor.setValue(value))
          }
          currentValue={params.value || ""}
        />
      ),
    },
  ];

  return (
    <div>
       <h2>Payment Details</h2>
      {isSuccess && parameterSuccess ? (
        <div data-testid="payment-table">
          <DataGrid
            columns={columns}
            rows={data}
            pagination
            paginationModel={{ pageSize: 40, page: 0 }}
            getRowId={(row:any) => row.paymentId}
            editMode="cell"
            // sx={{
            //   "& .MuiDataGrid-columnHeaders": {
            //     backgroundColor: "#9965f4",
            //     color: "#FFFFFF",
            //   },
            // }}
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
