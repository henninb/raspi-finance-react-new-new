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
  const [rows, setRows] = useState([]);

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

  const dataTest = [
    {
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
    },
    {
        "paymentId": 2597,
        "accountNameOwner": "chase_kari",
        "transactionDate": "2024-09-25",
        "amount": 1.50,
        "guidSource": "a4c9b4e0-2d65-4cd6-87d2-9d768e9b6c98",
        "guidDestination": "30cc1c7b-9b1f-42f5-9e93-e88f68e3b087",
        "activeStatus": true
    },
    {
        "paymentId": 2598,
        "accountNameOwner": "boa_brian",
        "transactionDate": "2024-09-25",
        "amount": 2.00,
        "guidSource": "02f7f12b-2823-4ab1-8003-d7421d60cdff",
        "guidDestination": "549b5cf7-4e6e-43c9-bd5e-855ce43bc2b3",
        "activeStatus": true
    },
    {
        "paymentId": 2599,
        "accountNameOwner": "citibank_brian",
        "transactionDate": "2024-09-26",
        "amount": 3.00,
        "guidSource": "d2920984-2b2a-4bc9-8ff7-80f1d9009c3c",
        "guidDestination": "115d9f65-003b-42fc-a0db-0d2859a51d27",
        "activeStatus": true
    },
    {
        "paymentId": 2600,
        "accountNameOwner": "rcard_brian",
        "transactionDate": "2024-09-26",
        "amount": 1.00,
        "guidSource": "a1f9b76d-6e7c-4d55-8fbb-d0b8e716a8bb",
        "guidDestination": "ac59473a-27f2-4be4-b71a-3000a9fbbc13",
        "activeStatus": true
    },
    {
        "paymentId": 2601,
        "accountNameOwner": "wellsfargo-cash_brian",
        "transactionDate": "2024-09-27",
        "amount": 2.00,
        "guidSource": "bb3f7d2d-f5fe-4e9a-b330-7c6fc80c9d6c",
        "guidDestination": "3c2f6a58-21b8-4d5e-97ba-bb28f5689fbc",
        "activeStatus": true
    },
    {
        "paymentId": 2602,
        "accountNameOwner": "chase_brian",
        "transactionDate": "2024-09-27",
        "amount": 1.50,
        "guidSource": "9cb94b35-0b08-4d3b-9730-0091c1003a94",
        "guidDestination": "b92f6fa2-93fa-41f4-b34f-bc4c0f75d869",
        "activeStatus": true
    },
    {
        "paymentId": 2603,
        "accountNameOwner": "boa_kari",
        "transactionDate": "2024-09-28",
        "amount": 2.00,
        "guidSource": "58205a47-9f8d-44f0-b649-07b8240b92a2",
        "guidDestination": "a35b4b9e-f6cc-4ad0-b535-f3a489e90262",
        "activeStatus": true
    },
    {
        "paymentId": 2604,
        "accountNameOwner": "citibank_brian",
        "transactionDate": "2024-09-28",
        "amount": 3.00,
        "guidSource": "f4e15dce-cc3e-49b1-b49f-7345079db4ff",
        "guidDestination": "731d0243-3f19-4298-a88d-f2ff8a5b3a44",
        "activeStatus": true
    },
    {
        "paymentId": 2605,
        "accountNameOwner": "rcard_brian",
        "transactionDate": "2024-09-29",
        "amount": 1.00,
        "guidSource": "bd59ecbb-b5d1-4695-9d6e-f4df8e35fc4e",
        "guidDestination": "f3855e1b-497f-4426-9185-c960f91f96a0",
        "activeStatus": true
    },
    {
        "paymentId": 2606,
        "accountNameOwner": "wellsfargo-cash_brian",
        "transactionDate": "2024-09-29",
        "amount": 2.00,
        "guidSource": "a2c0d635-2459-46f7-85a1-978f34356a5b",
        "guidDestination": "da416d58-3025-4310-b99b-1589cc39c9e9",
        "activeStatus": true
    },
    {
        "paymentId": 2607,
        "accountNameOwner": "chase_kari",
        "transactionDate": "2024-09-30",
        "amount": 1.50,
        "guidSource": "ea7791c1-75b8-4372-b6b9-81e9c4314e5a",
        "guidDestination": "872e6b79-0fdb-42ae-bc2b-d88b79fd49f2",
        "activeStatus": true
    },
    {
        "paymentId": 2608,
        "accountNameOwner": "boa_brian",
        "transactionDate": "2024-09-30",
        "amount": 2.00,
        "guidSource": "8dba1997-9bb1-490a-bdd8-6f9601ecfcf6",
        "guidDestination": "4853c7fc-6b60-4389-9b5a-5c68a6e9c5f7",
        "activeStatus": true
    }
]
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
    console.log("payment: " + JSON.stringify(payment))
    await deletePayment(
      { oldRow: payment },
      {
        onSuccess: () => {
          setRows((prevRows: any) => prevRows.filter((row: any) => row.paymentId !== payment.paymentId));
          setMessage("Row deleted successfully.");
          setOpen(true);
        },
        onError: (error) => {
          setMessage(`Error deleting row: ${error.message}`);
          setOpen(true);
        },
      }
    );
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
        <>
        <IconButton       
          onClick={() => {
            handleDeleteRow(params.row)

          }
          }
        >
          <UpdateIcon />
        </IconButton>
        <IconButton       
          onClick={() => {
            handleDeleteRow(params.row)
          }
          }
        >
          <DeleteIcon />
        </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
       <h2>Payment Details</h2>
      {showSpinner ?
      (
        <div data-testid="payment-table">
                      
            <IconButton 
              onClick={handleAddRow} 
              style={{ marginLeft: 8 }}>
              <AddIcon />
            </IconButton>
          <DataGrid
            columns={columns}
            rows={dataTest}
            pagination
            //paginationModel={{ pageSize: 40, page: 0 }}
            getRowId={(row:any) => row.paymentId}
            //editMode="cell"
            //hideFooterPagination={true}
            checkboxSelection={false}  // Disabling row selection (checkboxes)
            rowSelection={false}
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
