import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useMutation, useQueryClient } from "react-query";
import { TransactionState } from "../model/TransactionState";
import Transaction from "../model/Transaction";

const dataTest: Transaction = {
  transactionId: 10544,
  guid: "299b36b1-a49f-43bc-aaa5-ba78352f716a",
  accountId: 1029,
  accountType: "credit",
  transactionType: "undefined",
  accountNameOwner: "barclay-cash_brian",
  transactionDate: new Date("2017-09-17"),
  description: "balance adjustment",
  category: "none",
  amount: 1.99,
  transactionState: "outstanding",
  activeStatus: true,
  reoccurringType: "onetime",
  notes: "",
};

const getAccountKey = (accountNameOwner: string) => [
  "accounts",
  accountNameOwner,
];

const changeTransactionState = async (
  guid: string,
  newTransactionState: TransactionState,
): Promise<Transaction> => {
  try {
    const response = await axios.put(
      "/api/transaction/state/update/" + guid + "/" + newTransactionState,
      "{}",
      {
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: basicAuth(),
        },
      },
    );
    return response.data;
  } catch (error) {
    return dataTest;
  }
};

export default function useTransactionStateUpdate(accountNameOwner: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ["transactionState"],
    (variables: any) =>
      changeTransactionState(variables.guid, variables.transactionState),
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

      onSuccess: (response: any) => {
        const oldData: any = queryClient.getQueryData(
          getAccountKey(accountNameOwner),
        );

        const newData = oldData.map((element: any) => {
          if (element["guid"] === response.guid) {
            return { ...element, transactionState: response.transactionState };
          } else {
            return element;
          }
        });

        queryClient.setQueryData(getAccountKey(accountNameOwner), newData);
      },
    },
  );
}
