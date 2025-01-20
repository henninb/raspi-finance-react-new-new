import Spinner from "./Spinner";
import React, { useState, useEffect } from "react";
//import MaterialTable, { Column } from "material-table";
//import Button from "@material-ui/core/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useFetchPaymentRequired from "./queries/usePaymentRequiredFetch";
//import PaymentRequired from "./model/PaymentRequired";

export default function PaymentRequired() {
  const [showSpinner, setShowSpinner] = useState(true);
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchPaymentRequired();

  useEffect(() => {
    if (isSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess]);

  const handleButtonClickLink = (accountNameOwner: string) => {
    history("/transactions/" + accountNameOwner);
  };

  const columns: GridColDef[] = [
    {
      field: "accountNameOwner",
      headerName: "accountNameOwner",
      width: 180,
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
  ];

  return (
    <div>
      <h2>Payment Required Details</h2>
      {!showSpinner ? (
        <div data-testid="payment-required-table">
          <DataGrid
            columns={columns}
            rows={data}
            //paginationModel={{ pageSize: data?.length, page: 0 }}
            hideFooterPagination={true}
            getRowId={(row: any) => row.accountNameOwner}
          />
        </div>
      ) : (
        <div className="centered">
          <Spinner />
        </div>
      )}
    </div>
  );
}
