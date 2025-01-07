import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface Props {
  onChangeFunction: any;
  currentValue: any;
}

export default function SelectTransactionType({
  onChangeFunction,
  currentValue,
}: Props) {
  const [value, setValue] = useState(currentValue);
  const [inputValue, setInputValue] = useState("undefined");
  const [keyPressValue, setKeyPressValue] = useState("undefined");

  const options = ["expense", "income", "transfer"];

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      const filteredOptions = options.filter((state) =>
        state.includes(inputValue),
      );
      if (filteredOptions.length > 0) {
        return filteredOptions.find((state) => {
          setKeyPressValue(state);
          onChangeFunction(state);
          return state;
        });
      } else {
        setKeyPressValue("undefined");
        onChangeFunction(inputValue);
        return inputValue;
      }
    }
  };

  return (
    <div>
      <Autocomplete
        defaultValue={value ? value : "undefined"}
        value={value ? value : "undefined"}
        onChange={(_event :any, newValue: any) => {
          console.log(`onChange newValue: '${newValue}'`);
          setValue(newValue);
          onChangeFunction(newValue);
        }}
        inputValue={inputValue || "undefined"}
        onInputChange={(_event: any, newInputValue: any) => {
          if (keyPressValue === "undefined") {
            setInputValue(newInputValue);
          } else {
            setInputValue(keyPressValue);
            setKeyPressValue("undefined");
          }
        }}
        style={{ width: 140 }}
        options={options}
        renderInput={(params: any) => {
          return <TextField {...params} onKeyDown={(e) => handleKeyDown(e)} />;
        }}
      />
    </div>
  );
}
