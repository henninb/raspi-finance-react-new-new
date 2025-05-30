import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import useFetchAccount from "./queries/useAccountFetch";

export default function SelectAccountsNew() {
  const [options, setOptions] = useState([]);

  const handleChange = (selectedOption: any) => {
    history("/transactionsnew/" + selectedOption.value);
  };

  const history = useNavigate();
  const { data, isSuccess } = useFetchAccount();

  useEffect(() => {
    if (isSuccess) {
      const optionList: any = data.map(({ accountNameOwner }: any) => {
        return { value: accountNameOwner, label: accountNameOwner };
      });
      if (optionList.length > 0) {
        setOptions(optionList);
      }
    }
  }, [isSuccess, data]);

  return (
    <div className="select-formatting" data-test-id="account-name-owner-select">
      <Select
        options={options}
        onChange={handleChange}
        placeholder="account name owner..."
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#9965f4",
            primary: "#ffffff",
          },
        })}
      />
    </div>
  );
}
