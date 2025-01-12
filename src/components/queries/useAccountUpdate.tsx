import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import Account from "../model/Account";

const updateAccount = async (
  oldRow: Account,
  newRow: Account,
): Promise<any> => {
  let endpoint = "/api/account/update/" + oldRow.accountNameOwner;

  const response = await axios.put(endpoint, newRow, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useAccountUpdate() {
  const queryClient = useQueryClient();

  return useMutation(
    ["updateAccount"],
    (variables: any) => updateAccount(variables.oldRow, variables.newRow),
    {
      onError: (error: AxiosError<any>) => {
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

      onSuccess: (response : any) => {
        const oldData = queryClient.getQueryData<Account[]>("account");

        if (oldData) {
          // Combine the response with the existing data
          const newData = [response, ...oldData];
          queryClient.setQueryData("account", newData);
        } else {
          // If no old data, initialize with the new response
          queryClient.setQueryData("account", [response]);
        }
      },
    },
  );
}
