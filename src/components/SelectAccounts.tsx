import React, { useEffect, useState } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";
import { useNavigate } from "react-router-dom";
import useFetchAccount from "./queries/useFetchAccount";

interface Account {
  accountNameOwner: string;
}

interface Option {
  value: string;
  label: string;
}

export default function SelectAccounts() {
  const [options, setOptions] = useState<Option[]>([]);
  const navigate = useNavigate();
  const { data, isSuccess, isError, error } = useFetchAccount();

  const handleChange = (
    newValue: SingleValue<Option>,
    _actionMeta: ActionMeta<Option>,
  ) => {
    if (newValue) {
      navigate(`/transactions/${newValue.value}`);
    }
  };


  const dataTest = [    {
    "accountId": 1057,
    "accountNameOwner": "amazon_brian",
    "accountType": "debit",
    "activeStatus": true,
    "moniker": "0000",
    "outstanding": 0.00,
    "future": 25.45,
    "cleared": -25.45,
    "dateClosed": "1969-12-31T18:00:00.000-06:00"
},
{
    "accountId": 1001,
    "accountNameOwner": "amazon-store_brian",
    "accountType": "credit",
    "activeStatus": true,
    "moniker": "0000",
    "outstanding": 0.00,
    "future": 0.00,
    "cleared": 0.00,
    "dateClosed": "1970-01-01T00:00:00.000-06:00"
},
{
    "accountId": 1023,
    "accountNameOwner": "amex_brian",
    "accountType": "credit",
    "activeStatus": true,
    "moniker": "0000",
    "outstanding": -75.25,
    "future": 0.00,
    "cleared": 135.25,
    "dateClosed": "1970-01-01T00:00:00.000-06:00"
},]

  useEffect(() => {
    if (isSuccess && Array.isArray(data)) {
      const optionList = data
        .filter(
          (account: Account) =>
            typeof account.accountNameOwner === "string" &&
            account.accountNameOwner.trim() !== "",
        )
        .map(({ accountNameOwner }: Account) => ({
          value: accountNameOwner,
          label: accountNameOwner,
        }));

      setOptions(optionList);
    }
  }, [isSuccess, data]);

  if (isError) {
    return (
      <div className="error-message">
        <p>Error fetching accounts. Please try again.</p>
        {/* <pre>{JSON.stringify(error, null, 2)}</pre>{" "} */}
        {/* Display error details if available */}
      </div>
    );
  }

  if (!isSuccess || options.length === 0) {
    return <div>Loading accounts or no accounts available...</div>;
  }

  return (
    <div className="select-formatting" data-test-id="account-name-owner-select">
      <Select
        options={options}
        onChange={handleChange}
        placeholder="Select account name owner..."
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#9965f4",
            primary: "#ffffff",
          },
        })}
        aria-label="Select an account"
      />
    </div>
  );
}
