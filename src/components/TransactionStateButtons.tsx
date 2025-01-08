import React, { useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AttachMoneyRounded from "@mui/icons-material/AttachMoneyRounded";
import { TransactionState } from "./model/TransactionState";

export default function TransactionStateButtons({
  transactionState,
  guid,
  accountNameOwner,
  handlerToUpdateTransactionState,
}: any) {
  const colorOn = "green";
  const colorOff = "grey";

  const determineColor = (transactionState: TransactionState) => {
    if (transactionType === transactionState) {
      return colorOn;
    }
    return colorOff;
  };

  const [transactionType, setTransactionType] =
    React.useState(transactionState);
  const [clearedColor, setClearedColor] = React.useState(
    determineColor("cleared"),
  );
  const [outstandingColor, setOutStandingColor] = React.useState(
    determineColor("outstanding"),
  );
  const [futureColor, setFutureColor] = React.useState(
    determineColor("future"),
  );

  const setIconColorToGreen = (
    newTransactionState: "cleared" | "outstanding" | "future" | "undefined",
  ) => {
    if (newTransactionState === "cleared") {
      setClearedColor(colorOn);
      setOutStandingColor(colorOff);
      setFutureColor(colorOff);
    } else if (newTransactionState === "future") {
      setClearedColor(colorOff);
      setOutStandingColor(colorOff);
      setFutureColor(colorOn);
    } else if (newTransactionState === "outstanding") {
      setClearedColor(colorOff);
      setOutStandingColor(colorOn);
      setFutureColor(colorOff);
    }
  };

  const handleTransactionType = (
    _event: any,
    newTransactionState: TransactionState,
  ) => {
    setIconColorToGreen(newTransactionState);
    handlerToUpdateTransactionState(
      guid,
      accountNameOwner,
      newTransactionState,
    );
    setTransactionType(newTransactionState);
  };

  useEffect(() => {
    if (transactionState !== transactionType) {
      setIconColorToGreen(transactionState);
      setTransactionType(transactionState);
    }
  }, [transactionType, transactionState]);

  return (
    <ToggleButtonGroup
      value={transactionType}
      exclusive
      onChange={handleTransactionType}
      aria-label="Transaction State"
    >
      <ToggleButton value="future" sx={{ fontSize: ".6rem" }}>
        <AttachMoneyRounded sx={{ color: futureColor, fontSize: "small" }} />
      </ToggleButton>

      <ToggleButton value="outstanding" sx={{ fontSize: ".6rem" }}>
        <AttachMoneyRounded
          sx={{ color: outstandingColor, fontSize: "small" }}
        />
      </ToggleButton>

      <ToggleButton value="cleared" sx={{ fontSize: ".6rem" }}>
        <AttachMoneyRounded sx={{ color: clearedColor, fontSize: "small" }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
