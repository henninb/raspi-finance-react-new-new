import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SnackbarBaseline from "./SnackbarBaseline";
import useFetchDescription from "./queries/useFetchDescription";
import useDescriptionInsert from "./queries/useDescriptionInsert";
import Description from "./model/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import { Modal, Box, Button, TextField } from "@mui/material";

export default function DescriptionTable() {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [descriptionData, setDescriptionData] = useState<Description | null>(null);

  const { data, isSuccess } = useFetchDescription();
  const { mutate: insertDescription } = useDescriptionInsert();

  useEffect(() => {
    if (isSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess]);

  const handleSnackbarClose = () => setOpen(false);

  const handleError = (error: any, moduleName: string, throwIt: boolean) => {
    const errorMsg =
      error.response?.data || `${moduleName}: failure - ${error.message}`;
    setMessage(`${moduleName}: ${errorMsg}`);
    console.error(`${moduleName}:`, error);
    setOpen(true);

    if (throwIt) throw error;
  };

  const addRow = async (newData: Description): Promise<string> => {
    try {
      const descriptionPayload = {
        ...newData,
        status: true,
      };
      await insertDescription({ payload: descriptionPayload });
      return "success";
    } catch (error) {
      handleError(error, "addRow", false);
      throw error;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "descriptionName",
      headerName: "Description",
      width: 200,
      editable: true,
    },
    {
      field: "activeStatus",
      headerName: "Status",
      width: 100,
      editable: true,
    },
    {
      field: "",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => {//handleDeleteRow(params.row)
          }}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // const handleAddRow = () => {
  //   return {
  //     descriptionId: Math.random(),
  //     descriptionName: "",
  //     activeStatus: true,
  //   };
  // };

  return (
    <div>
      <h2>Description Details</h2>
      {!showSpinner ? (
        <div data-testid="description-table">
          <IconButton
            onClick={() => {
              setOpenForm(true);
              //setDescriptionData(handleAddRow());
            }}
            style={{ marginLeft: 8 }}
          >
            <AddIcon />
          </IconButton>
          <DataGrid
            columns={columns}
            rows={data}
            getRowId={(row: Description) => row.descriptionId}
            processRowUpdate={(newRow: any, oldRow: any) => {
              console.log("Row updated:", newRow);
              return newRow;
            }}
          />
          <SnackbarBaseline
            message={message}
            state={open}
            handleSnackbarClose={handleSnackbarClose}
          />
        </div>
      ) : (
        <div className="centered">
          <Spinner data-test-id="descriptions-spinner" />
        </div>
      )}

      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        aria-labelledby="form-modal"
        aria-describedby="form-modal-description"
      >
        <Box
          sx={{
            width: 400,
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            top: "20%",
          }}
        >
          <h3>{descriptionData ? "Edit Description" : "Add New Description"}</h3>

          <TextField
            label="Description"
            value={descriptionData?.descriptionName || ""}
            onChange={(e) =>
              setDescriptionData((prev: any) => ({
                ...prev,
                descriptionName: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Status"
            value={descriptionData?.activeStatus || ""}
            onChange={(e) =>
              setDescriptionData((prev: any) => ({
                ...prev,
                activeStatus: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => descriptionData && addRow(descriptionData)}
              style={{ marginTop: 16 }}
            >
              {descriptionData ? "Update" : "Add"}
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
