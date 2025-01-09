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
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { useMatch, PathMatch } from "react-router-dom";

export default function AccountSummaryTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
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
      cellClassName: "nowrap",
    },
    {
      field: "accountType",
      headerName: "Account Type",
      width: 150,
      cellClassName: "nowrap",
    },
    {
      field: "moniker",
      headerName: "Moniker",
      width: 150,
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

  return (
    <div>
    <h2>Account Details</h2>
      {!showSpinner ? (
        <div data-testid="account-table">
            <IconButton 
              //onClick={handleAddRow} 
              style={{ marginLeft: 8 }}>
              <AddIcon />
            </IconButton>

        <h2>`[ ${currencyFormat(
              noNaN(totals["totals"]),
            )} ] [ ${currencyFormat(
              noNaN(totals["totalsCleared"]),
            )} ]  [ ${currencyFormat(
              noNaN(totals["totalsOutstanding"]),
            )} ] [ ${currencyFormat(noNaN(totals["totalsFuture"]))} ]`</h2>


          <DataGrid 
            columns={columns} 
            rows={data} 
            getRowId={(row) => row.accountId}
            paginationModel={{ pageSize: data?.length, page: 0 }}
            hideFooterPagination={true}
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
    </div>
  );
}
