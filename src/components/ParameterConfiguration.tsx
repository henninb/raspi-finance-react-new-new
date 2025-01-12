import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton, Modal, Box, Button, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/CreateRounded';
import AddIcon from '@mui/icons-material/AddRounded';
import useFetchParameters from "./queries/useFetchParameters";
import useParameterDelete from "./queries/useParameterDelete";
import useParameterUpdate from "./queries/useParameterUpdate";
import Parameter from "./model/Parameter";

export default function ParameterConfiguration() {
  const [showSpinner, setShowSpinner] = useState(true);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [parameterData, setParameterData] = useState<Parameter | null>(null); // Store parameter being edited
  const { data, isSuccess } = useFetchParameters();
  const { mutate: deleteParameter } = useParameterDelete();
  const { mutate: updateParameter } = useParameterUpdate();

  useEffect(() => {
    if (isSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess]);

  const handleDelete = async (parameterName: string) => {
    await deleteParameter({ parameterName });
  };

  const handleUpdate = async (newData: Parameter) => {
    if (parameterData) {
      const updatedData = { ...parameterData, ...newData };
      await updateParameter({ newRow: updatedData, oldRow: parameterData });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "parameterName",
      headerName: "Parameter Name",
      width: 250,
      editable: true,
    },
    {
      field: "parameterValue",
      headerName: "Parameter Value",
      width: 300,
      editable: true,
    },
    {
      field: "",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => {
              setParameterData(params.row);
              setOpenForm(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.parameterName)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Parameter Configuration</h2>
      {showSpinner ? (
        <div className="centered">
          <Spinner />
        </div>
      ) : (
        <div>
                    <IconButton 
              onClick={() => {
                setOpenForm(true)
                //return handleAddRow
                }
              } 
              style={{ marginLeft: 8 }}>
              <AddIcon />
            </IconButton>
          <DataGrid
            columns={columns}
            rows={data}
            paginationModel={{ pageSize: data?.length, page: 0 }}
            hideFooterPagination={true}
            getRowId={(row: Parameter) => row.parameterId}
          />
        </div>
      )}

      {/* Modal for Editing/Adding Parameter */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        aria-labelledby="form-modal"
        aria-describedby="form-modal-description"
      >
        <Box sx={{ width: 400, padding: 4, backgroundColor: "white", margin: "auto", top: "20%" }}>
          <h3>{parameterData ? "Edit Parameter" : "Add New Parameter"}</h3>

          <TextField
            label="Parameter Name"
            value={parameterData?.parameterName || ""}
            onChange={(e) =>
              setParameterData((prev: any) => ({ ...prev, parameterName: e.target.value }))
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Parameter Value"
            value={parameterData?.parameterValue || ""}
            onChange={(e) =>
              setParameterData((prev:any) => ({ ...prev, parameterValue: e.target.value }))
            }
            fullWidth
            margin="normal"
          />

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => parameterData && handleUpdate(parameterData)}
              style={{ marginTop: 16 }}
            >
              {parameterData ? "Update" : "Add"}
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
