import { basicAuth } from "../Common";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";

const dataTest = [{ totalsFuture: 25.45, totalsCleared: -25.45, totals: 0.0 }];

const fetchTotalsPerAccount = async (accountNameOwner: any): Promise<any> => {
  try {
    const response = await axios.get(
      "/api/transaction/account/totals/" + accountNameOwner,
      {
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: basicAuth(),
        },
      },
    );
    //console.debug(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching totalsPerPayment data:", error);
    return dataTest;
  }
};

export default function useFetchTotalsPerAccount(accountNameOwner: any) {
  return useQuery(
    ["totals", accountNameOwner],
    () => fetchTotalsPerAccount(accountNameOwner),
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
    },
  );
}
