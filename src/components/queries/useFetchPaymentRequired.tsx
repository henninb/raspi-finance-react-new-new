import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const dataTest = [  {
  accountNameOwner: "wfargo-cc_brian",
  accountType: "credit",
  moniker: "0000",
  future: 200.0,
  outstanding: 1500.25,
  cleared: 1300.25,
},
{
  accountNameOwner: "chase_susan",
  accountType: "credit",
  moniker: "0000",
  future: 1000.0,
  outstanding: 5000.75,
  cleared: 4000.75,
},
{
  accountNameOwner: "boa_michael",
  accountType: "credit",
  moniker: "0000",
  future: 0.0,
  outstanding: 0.0,
  cleared: 1.0,
}]

const fetchPaymentRequiredData = async (): Promise<any> => {
  try {
    const response = await axios.get("/api/transaction/payment/required", {
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
    console.error("Error fetching paymentRequired data:", error);
    return dataTest
  }
};

export default function useFetchPaymentRequired() {
  return useQuery("payment_required", () => fetchPaymentRequiredData(), {
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
  });
}
