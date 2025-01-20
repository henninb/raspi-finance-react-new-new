import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const dataTest = [
  {
    validationId: 2085,
    accountId: 1023,
    validationDate: 1736459500288,
    activeStatus: true,
    transactionState: "cleared",
    amount: 60.0,
  },
];

const fetchValidationAmountData = async (
  accountNameOwner: string,
): Promise<any> => {
  try {
    const response = await axios.get(
      `/api/validation/amount/select/${accountNameOwner}/cleared`,
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
    console.error("Error fetching validationAmount data:", error);
    return dataTest;
  }
};

export default function useFetchValidationAmount(accountNameOwner: string) {
  return useQuery(
    ["validationAmount", accountNameOwner],
    () => fetchValidationAmountData(accountNameOwner),
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
