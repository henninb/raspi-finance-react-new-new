import React, { useState, useEffect } from "react";
import SelectAccountNameOwnerCredit from "./SelectAccountNameOwnerCredit";
import SelectAccountNameOwnerDebit from "./SelectAccountNameOwnerDebit";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
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
  const [showSpinner, setShowSpinner] = useState(true);

  const [newRow, setNewRow] = useState({
    paymentId: Math.random(), // Generate unique ID
    accountNameOwner: "",
    transactionDate: moment().format("YYYY-MM-DD"),
    amount: 0.0,
    guidSource: "",
    guidDestination: "",
    activeStatus: true,
  });

  const history = useNavigate();
  const { data, isSuccess } = useFetchPayment();
  const { data: parameterData, isSuccess: parameterSuccess } =
    useFetchParameter("payment_account");
  const { mutate: insertPayment } = usePaymentInsert();
  const { mutate: deletePayment } = usePaymentDelete();

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess && parameterSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess, parameterSuccess]);

  const handleButtonClickLink = (rowData: Transaction) => {
    history("/transactions/" + rowData.accountNameOwner);
  };

  const handleAddRow = async () => {
    try {
      await insertPayment(
        { newRow },
        {
          onSuccess: () => {
            setMessage("Row added successfully.");
            setOpen(true);
            setNewRow({
              paymentId: Math.random(),
              accountNameOwner: "",
              transactionDate: moment().format("YYYY-MM-DD"),
              amount: 0.0,
              guidSource: "",
              guidDestination: "",
              activeStatus: true,
            });
          },
          onError: (error) => {
            setMessage(`Error adding row: ${error.message}`);
            setOpen(true);
          },
        }
      );
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  const handleDeleteRow = async (payment: Payment) => {
    //console.log("payment: " + JSON.stringify(payment))
    await deletePayment({ oldRow: payment });
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
      field: "sourceAccount",
      headerName: "Source Account",
      width: 180,
      editable: true,
      renderCell: (params) => parameterData?.parameterValue || "none",
      renderEditCell: (params: any) => (
        <SelectAccountNameOwnerDebit
          onChangeFunction={(value: any) =>
            params.api
              .getCellEditorInstances()
              .forEach((editor: any) => editor.setValue("parameterData.parameterValue"))
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
       <h2>Payment Details</h2>
      {!showSpinner ?
      (
        <div data-testid="payment-table">
                      
            <IconButton 
              onClick={handleAddRow} 
              style={{ marginLeft: 8 }}>
              <AddIcon />
            </IconButton>
          <DataGrid
            columns={columns}
            rows={data}
            pagination
            //paginationModel={{ pageSize: 40, page: 0 }}
            getRowId={(row:any) => row.paymentId}
            //editMode="cell"
            //hideFooterPagination={true}
            checkboxSelection={false}  // Disabling row selection (checkboxes)
            rowSelection={false}
            //experimentalFeatures={{ newEditingApi: true }}
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
