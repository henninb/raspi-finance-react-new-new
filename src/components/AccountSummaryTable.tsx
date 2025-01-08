import React, { useState } from "react";
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

export default function AccountSummaryTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchAccount();
  const { data: totals, isSuccess: isSuccessTotals } = useFetchTotals();
  const { mutate: insertAccount } = useAccountInsert();
  const { mutate: deleteAccount } = useAccountDelete();

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
      valueFormatter: (params: any) =>
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
      valueFormatter: (params: any) =>
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
      valueFormatter: (params: any) =>
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
          // @ts-ignore
          resolve();
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
    <>
      {!isLoading && isSuccess && isSuccessTotals ? (
        <div>
          <DataGrid 
            columns={columns} 
            rows={data} 
            getRowId={(row) => row.accountId} // Set the rowId to accountId
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
    </>
  );
}
