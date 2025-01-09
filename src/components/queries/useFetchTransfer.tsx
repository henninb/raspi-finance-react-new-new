import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const dataTest = [
  {
      "transferId": 1,
      "sourceAccount": "barclays-savings_brian",
      "destinationAccount": "wellsfargo-savings_kari",
      "transactionDate": "2025-01-04",
      "amount": 3.00,
      "guidSource": "00a8a750-cc3d-4c24-9263-c85af59cab64",
      "guidDestination": "00a8a750-cc3d-4c24-9263-c85af59cab64",
      "activeStatus": true
  },
  {
      "transferId": 2,
      "sourceAccount": "barclays-savings_brian",
      "destinationAccount": "wellsfargo-savings_kari",
      "transactionDate": "2025-01-04",
      "amount": 2.00,
      "guidSource": "00a8a750-cc3d-4c24-9263-c85af59cab64",
      "guidDestination": "00a8a750-cc3d-4c24-9263-c85af59cab64",
      "activeStatus": true
  }
];

const fetchTransferData = async (): Promise<any> => {
  try {
    const response = await axios.get("/api/transfer/select", {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    });
    //console.debug(JSON.stringify(response.data));
    return response.data;
  } catch(error) {
    console.error("Error fetching transfer data:", error);
    return dataTest
  }
};

export default function useFetchTransfer() {
  return useQuery("transfer", () => fetchTransferData(), {
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
  });
}
