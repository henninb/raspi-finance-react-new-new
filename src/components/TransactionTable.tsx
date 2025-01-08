import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const TransactionTable: React.FC = () => {
  // Define columns (placeholder)
  const columns: GridColDef[] = [];

  // Define rows (placeholder)
  const rows: any[] = [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default TransactionTable;
