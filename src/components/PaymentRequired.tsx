import Spinner from "./Spinner";
import React, { FC } from "react";
//import MaterialTable, { Column } from "material-table";
//import Button from "@material-ui/core/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useFetchPaymentRequired from "./queries/useFetchPaymentRequired";

interface PaymentRequiredData {
  accountNameOwner: string;
  accountType: string;
  moniker: string;
  future: number;
  outstanding: number;
  cleared: number;
}

const PaymentRequired: FC = () => {
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchPaymentRequired();

  const handleButtonClickLink = (accountNameOwner: string) => {
    history("/transactions/" + accountNameOwner);
  };

  const columns: GridColDef[] = [
    {
      field: "accountNameOwner",
      headerName: "accountNameOwner",
      width: 180, // Optional: specify a width
      renderCell: (params) => (
        <Button
          style={{ fontSize: ".6rem" }}
          onClick={() => handleButtonClickLink(params.row.accountNameOwner)}
        >
          {params.row.accountNameOwner}
        </Button>
      ),
      cellClassName: "nowrap", // Custom class for CSS if needed
    },
    {
      field: "accountType",
      headerName: "accountType",
      width: 150,
    },
    {
      field: "moniker",
      headerName: "moniker",
      width: 150,
    },
    {
      field: "future",
      headerName: "future",
      type: "number",
      editable: false,
      width: 150,
      valueFormatter: (params: any) =>
        params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "outstanding",
      headerName: "outstanding",
      type: "number",
      editable: false,
      width: 150,
      valueFormatter: (params: any) =>
        params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "cleared",
      headerName: "cleared",
      type: "number",
      editable: false,
      width: 150,
      valueFormatter: (params: any) =>
        params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "aftermath",
      headerName: "aftermath",
      type: "number",
      editable: false,
      width: 150,
      renderCell: (params: any) => {
        const aftermath =
          params.row.cleared + params.row.outstanding + params.row.future;
        return aftermath.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
  ];

  return (
    <div>
      {!isLoading && isSuccess ? (
        <div data-testid="payment-required-table">
          <DataGrid
            columns={columns}
            rows={data}
            //pageSize={25}
            autoPageSize
            //rowsPerPageOptions={[5, 10]}
            checkboxSelection
            //disableSelectionOnClick
            //onProcessRowUpdate={handleRowEdit}
          />
        </div>
      ) : (
        <div className="centered">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default PaymentRequired;
