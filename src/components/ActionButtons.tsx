import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import Delete from "@mui/icons-material/Delete";
import Update from "@mui/icons-material/Update";

export default function ActionButtons({ guid }: any) {
  const handleTransactionType = (event: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) {
      console.log(value);
    }
  };

  return (
    <div data-testid="action-buttons">
      <ToggleButtonGroup
        value={""}
        exclusive
        onChange={handleTransactionType}
        aria-label="text transactionType"
      >
        <div data-testid="move-button">
          <ToggleButton value="move" aria-label="move transaction">
            <ChevronRightRounded
              style={{ color: "black", fontSize: "small" }}
            />
          </ToggleButton>
        </div>

        <div data-testid="update-button">
          <ToggleButton value="update" aria-label="update transaction">
            <Update style={{ color: "black", fontSize: "small" }} />
          </ToggleButton>
        </div>

        <div data-testid="delete-button">
          <ToggleButton value="delete" aria-label="delete transaction">
            <Delete style={{ color: "black", fontSize: "small" }} />
          </ToggleButton>
        </div>
      </ToggleButtonGroup>
    </div>
  );
}
