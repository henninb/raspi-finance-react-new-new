import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { currencyFormat, noNaN } from "./Common";
import SnackbarBaseline from "./SnackbarBaseline";
import useFetchAccount from "./queries/useFetchAccount";
import useAccountInsert from "./queries/useAccountInsert";
import useAccountDelete from "./queries/useAccountDelete";
import useFetchTotals from "./queries/useFetchTotals";
import Account from "./model/Account";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { useMatch, PathMatch } from "react-router-dom";
import { Modal } from "@mui/material";
import {Box} from "@mui/material";
import {Button} from "@mui/material";
import {TextField} from "@mui/material";

export default function AccountSummaryTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [openForm, setOpenForm] = useState<boolean>(false);  // State to control the form overlay
  const [accountData, setAccountData] = useState<Account | null>(null); // State to store the data being edited
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchAccount();
  const { data: totals, isSuccess: isSuccessTotals } = useFetchTotals();
  const { mutate: insertAccount } = useAccountInsert();
  const { mutate: deleteAccount } = useAccountDelete();

   useEffect(() => {
     if (isSuccess && isSuccessTotals) {
       setShowSpinner(false);
     }
   }, [isSuccess, isSuccessTotals]); 

  const handleButtonClickLink = (accountNameOwner: string) => {
    history("/transactions/" + accountNameOwner);
  };

  const columns: GridColDef[] = [
    {
      field: "accountNameOwner",
      headerName: "Account Name Owner",
      width: 200,
      renderCell: (params) => (
        <Button
          style={{ fontSize: ".6rem" }}
          onClick={() => handleButtonClickLink(params.row.accountNameOwner)}
        >
          {params.row.accountNameOwner}
        </Button>
      ),
      editable: true,
      cellClassName: "nowrap",
    },
    {
      field: "accountType",
      headerName: "Account Type",
      width: 150,
      editable: true,
      cellClassName: "nowrap",
    },
    {
      field: "moniker",
      headerName: "Moniker",
      width: 150,
      editable: true,
      cellClassName: "nowrap",
    },
    {
      field: "future",
      headerName: "Future",
      width: 150,
      type: "number",
      editable: false,
      renderCell: (params: any) =>
        params.value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      cellClassName: "nowrap",
    },
    {
      field: "outstanding",
      headerName: "Outstanding",
      width: 150,
      type: "number",
      editable: false,
      renderCell: (params: any) =>
        params.value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      cellClassName: "nowrap",
    },
    {
      field: "cleared",
      headerName: "Cleared",
      width: 150,
      type: "number",
      editable: false,
      renderCell: (params: any) =>
        params.value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      cellClassName: "nowrap",
    },
    // {
    //   field: "aftermath",
    //   headerName: "Aftermath",
    //   width: 200,
    //   type: "number",
    //   editable: false,
    //   valueFormatter: (params: any) =>
    //     params.value?.toLocaleString("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }),
    //   cellClassName: "nowrap",
    // },
    {
      field: "",
      headerName: "",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <div>
        <IconButton       
          onClick={() => {
            console.log("handleDeleteRow(params.row)");
          }
          }
        >
          <DeleteIcon />
        </IconButton>
        </div>
      ),
    },
  ];

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

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const addRow = (newData: Account) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          insertAccount({ payload: newData });
          resolve("success");
        } catch (error) {
          handleError(error, "addRow", false);
          reject();
        }
      }, 1000);
    });
  };

  const deleteRow = (oldData: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await deleteAccount({ oldRow: oldData });
          resolve("success");
        } catch (error) {
          handleError(error, "onRowDelete", false);
          reject();
        }
      }, 1000);
    });
  };

  const handleAddRow = () => {
    return {
      accountId: Math.random(),
      accountType: 'undefined',
      activeStatus: true,
    };
  };

  return (
    <div>
    <h2>Account Details</h2>
      {!showSpinner ? (
        <div data-testid="account-table">
            <IconButton 
              onClick={() => {
                setOpenForm(true)
                return handleAddRow
                }
              } 
              style={{ marginLeft: 8 }}>
              <AddIcon />
            </IconButton>

        <h2>[ ${currencyFormat(
              noNaN(totals["totals"]),
            )} ] [ ${currencyFormat(
              noNaN(totals["totalsCleared"]),
            )} ]  [ ${currencyFormat(
              noNaN(totals["totalsOutstanding"]),
            )} ] [ ${currencyFormat(noNaN(totals["totalsFuture"]))} ]</h2>


          <DataGrid 
            columns={columns} 
            rows={data} 
            getRowId={(row) => row.accountId}
            paginationModel={{ pageSize: data?.length, page: 0 }}
            hideFooterPagination={true}
            processRowUpdate={(newRow :any, oldRow: any) => {
              // Handle row update here
              console.log('Row updated:', newRow);
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
          <Spinner />
        </div>
      )}

{/* Modal for Adding/Editing Account */}
<Modal
  open={openForm}
  onClose={() => setOpenForm(false)}
  aria-labelledby="account-form-modal"
  aria-describedby="account-form-modal-description"
>
  <Box
    sx={{
      width: 400,
      padding: 4,
      backgroundColor: "white",
      margin: "auto",
      top: "20%",
      position: "relative",
      boxShadow: 24,
      borderRadius: 2,
    }}
  >
    <h3>{accountData ? "Edit Account" : "Add New Account"}</h3>

    <TextField
      label="Account Name Owner"
      value={accountData?.accountNameOwner || ""}
      onChange={(e) =>
        setAccountData((prev: any) => ({
          ...prev,
          accountNameOwner: e.target.value,
        }))
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Account Type"
      value={accountData?.accountType || ""}
      onChange={(e) =>
        setAccountData((prev: any) => ({
          ...prev,
          accountType: e.target.value,
        }))
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Moniker"
      value={accountData?.moniker || ""}
      onChange={(e) =>
        setAccountData((prev: any) => ({
          ...prev,
          moniker: e.target.value,
        }))
      }
      fullWidth
      margin="normal"
    />

    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => accountData && addRow(accountData)}
        style={{ marginTop: 16 }}
      >
        {accountData ? "Update" : "Add"}
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
