import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SelectCategory from "./SelectCategory";
import SelectTransactionState from "./SelectTransactionState";
import SelectTransactionType from "./SelectTransactionType";
import SelectReoccurringType from "./SelectReoccurringType";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';

export default function TransactionTable() {
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
    {
      field: 'description',
      headerName: 'Description',
      width: 180,
      editable: true,
      renderCell: (params) => (
        <div>
          {params.value}
          <Button
            onClick={() => {
              // Your logic here to handle editing
            }}
          >
            Edit
          </Button>
        </div>
      ),
      renderEditCell: (params: any) => (
        <TextField
          value={params.value || ''}
          onChange={(e: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(e.target.value))}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      editable: true,
      // renderEditCell: (params: any) => (
      //   <SelectCategory
      //     currentValue={params.value || 'none'}
      //     onChange={(newValue: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(newValue))}
      //   />
      // ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'transactionState',
      headerName: 'State',
      width: 180,
      renderCell: (params) => <div>{params.value}</div>,
      // renderEditCell: (params: any) => (
      //   <SelectTransactionState
      //     currentValue={params.value || 'outstanding'}
      //     onChange={(newValue: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(newValue))}
      //   />
      // ),
    },
    {
      field: 'transactionType',
      headerName: 'Type',
      width: 180,
      renderCell: (params: any) => params.value || 'undefined',
      // renderEditCell: (params) => (
      //   <SelectTransactionType
      //     currentValue={params.value || 'undefined'}
      //     //onChange={(newValue: any) => params.api.getCellEditorInstances().forEach((editor : any) => editor.setValue(newValue))}
      //   />
      // ),
    },
    {
      field: 'reoccurringType',
      headerName: 'Reoccur',
      width: 150,
      renderCell: (params: any) => params.value || 'undefined',
      // renderEditCell: (params: any) => (
      //   <SelectReoccurringType
      //     currentValue={params.value || 'onetime'}
      //     onChange={(newValue: any) => params.api.getCellEditorInstances().forEach((editor: any) => editor.setValue(newValue))}
      //   />
      // ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 180,
      editable: true,
    },
    {
      field: 'receiptImage',
      headerName: 'Image',
      editable: false,
      //filtering: false,
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value ? (
            <img src={params.value.thumbnail} alt="receipt" style={{ width: '50px', height: '50px' }} />
          ) : (
            <Button onClick={() => {/* Handle image upload or view */}}>Upload Image</Button>
          )}
        </div>
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
            //handleDeleteRow(params.row)
          }
          }
        >
          <UpdateIcon />
        </IconButton>
        <IconButton       
          onClick={() => {
            //handleDeleteRow(params.row)
          }
          }
        >
          <DeleteIcon />
        </IconButton>
        </>
      ),
    },
  ];

  const data: any[] = [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid 
        rows={data}
        columns={columns} 
        pagination
        //paginationModel={{ pageSize: 40, page: 0 }}
        getRowId={(row:any) => row.transactionId}
        checkboxSelection={false}
        rowSelection={false}
      />
    </div>
  );
};
