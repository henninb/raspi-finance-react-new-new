import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SnackbarBaseline from "./SnackbarBaseline";
import useFetchCategory from "./queries/useFetchCategory";
import useCategoryInsert from "./queries/useCategoryInsert";
//import useCategoryDelete from "./queries/useCategoryDelete";
import Category from "./model/Category";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import { Modal, Box, Button, TextField } from "@mui/material";

export default function CategoryTable() {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<Category | null>(null);

  const { data, isSuccess } = useFetchCategory();
  const { mutate: insertCategory } = useCategoryInsert();
  //const { mutate: deleteCategory } = useCategoryDelete();

  useEffect(() => {
    if (isSuccess) {
      setShowSpinner(false);
    }
  }, [isSuccess]);

  const handleSnackbarClose = () => setOpen(false);

  //   const handleDeleteRow = async (category: Category) => {
  //     await deleteCategory({ oldRow: category });
  //   };

  const handleError = (error: any, moduleName: string, throwIt: boolean) => {
    const errorMsg =
      error.response?.data || `${moduleName}: failure - ${error.message}`;
    setMessage(`${moduleName}: ${errorMsg}`);
    console.error(`${moduleName}:`, error);
    setOpen(true);

    if (throwIt) throw error;
  };

  const addRow = async (newData: Category): Promise<string> => {
    try {
      const categoryData = {
        ...newData,
        activeStatus: true,
      };
      await insertCategory({ payload: categoryData });
      return "success";
    } catch (error) {
      handleError(error, "addRow", false);
      throw error;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "categoryName",
      headerName: "Category Name",
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
          <IconButton
            onClick={() => {
              //handleDeleteRow(params.row)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAddRow = () => {
    return {
      categoryId: Math.random(),
      name: "",
      description: "",
      activeStatus: true,
    };
  };

  return (
    <div>
      <h2>Category Details</h2>
      {!showSpinner ? (
        <div data-testid="category-table">
          <IconButton
            onClick={() => {
              setOpenForm(true);
              //setCategoryData(handleAddRow());
            }}
            style={{ marginLeft: 8 }}
          >
            <AddIcon />
          </IconButton>
          <DataGrid
            columns={columns}
            rows={data}
            getRowId={(row: Category) => row.categoryId}
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
          <Spinner data-test-id="categories-spinner" />
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
          <h3>{categoryData ? "Edit Category" : "Add New Category"}</h3>

          <TextField
            label="Category"
            value={categoryData?.categoryName || ""}
            onChange={(e) =>
              setCategoryData((prev: any) => ({
                ...prev,
                categoryName: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Status"
            value={categoryData?.activeStatus || ""}
            onChange={(e) =>
              setCategoryData((prev: any) => ({
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
              onClick={() => categoryData && addRow(categoryData)}
              style={{ marginTop: 16 }}
            >
              {categoryData ? "Update" : "Add"}
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
