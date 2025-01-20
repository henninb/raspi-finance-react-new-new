import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import Account from "../model/Account";

const setupNewAccount = (payload: Account) => {
  return {
    accountNameOwner: payload.accountNameOwner,
    accountType: payload.accountType,
    moniker: payload.moniker,
    cleared: 0.0,
    future: 0.0,
    outstanding: 0.0,
    dateClosed: new Date(0),
    dateAdded: new Date(),
    dateUpdated: new Date(),
    activeStatus: true,
  };
};

const insertAccount = async (payload: Account): Promise<any> => {
  try {
    const endpoint = "/api/account/insert";
    const newPayload = setupNewAccount(payload);

    const response = await axios.post(endpoint, newPayload, {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(),
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        console.error("Resource not found (404).", error.response.data);
        // React to 404 specifically
        return {
          accountId: Math.random(),
          accountNameOwner: payload.accountNameOwner,
          accountType: payload.accountType,
          moniker: payload.moniker,
          cleared: 0.0,
          future: 0.0,
          outstanding: 0.0,
          dateClosed: new Date(0),
          dateAdded: new Date(),
          dateUpdated: new Date(),
          activeStatus: true,
        };
      }
    }

    return { error: "An error occurred", details: error.message };
  }
};

export default function useAccountInsert() {
  const queryClient = useQueryClient();

  return useMutation(
    ["insertAccount"],
    (variables: any) => insertAccount(variables.payload),
    {
      onError: (error: AxiosError) => {
        console.log(error ? error : "error is undefined.");
        console.log(
          error.response ? error.response : "error.response is undefined.",
        );
        console.log(
          error.response
            ? JSON.stringify(error.response)
            : "error.response is undefined - cannot stringify.",
        );
      },

      onSuccess: (response) => {
        const oldData: any = queryClient.getQueryData("account");
        const newData = [response, ...oldData];
        queryClient.setQueryData("account", newData);
      },
    },
  );
}
