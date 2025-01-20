import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const dataTest = [
  {
    paymentId: 2593,
    accountNameOwner: "rcard_brian",
    transactionDate: "2024-09-24",
    amount: 1.0,
    guidSource: "90bea775-5b25-40f2-bc30-ca95a8083c1c",
    guidDestination: "4fde7725-1960-42ca-87c0-204040429e6a",
    activeStatus: true,
  },
  {
    paymentId: 2595,
    accountNameOwner: "wellsfargo-cash_brian",
    transactionDate: "2024-09-24",
    amount: 1.0,
    guidSource: "feb5fd7f-ca40-4faa-a031-c5fa4f0c02a5",
    guidDestination: "c01495ae-46a6-45c1-8de1-6afaebb18673",
    activeStatus: true,
  },
  {
    paymentId: 2597,
    accountNameOwner: "chase_kari",
    transactionDate: "2024-09-25",
    amount: 1.5,
    guidSource: "a4c9b4e0-2d65-4cd6-87d2-9d768e9b6c98",
    guidDestination: "30cc1c7b-9b1f-42f5-9e93-e88f68e3b087",
    activeStatus: true,
  },
  {
    paymentId: 2598,
    accountNameOwner: "boa_brian",
    transactionDate: "2024-09-25",
    amount: 2.0,
    guidSource: "02f7f12b-2823-4ab1-8003-d7421d60cdff",
    guidDestination: "549b5cf7-4e6e-43c9-bd5e-855ce43bc2b3",
    activeStatus: true,
  },
  {
    paymentId: 2599,
    accountNameOwner: "citibank_brian",
    transactionDate: "2024-09-26",
    amount: 3.0,
    guidSource: "d2920984-2b2a-4bc9-8ff7-80f1d9009c3c",
    guidDestination: "115d9f65-003b-42fc-a0db-0d2859a51d27",
    activeStatus: true,
  },
  {
    paymentId: 2600,
    accountNameOwner: "rcard_brian",
    transactionDate: "2024-09-26",
    amount: 1.0,
    guidSource: "a1f9b76d-6e7c-4d55-8fbb-d0b8e716a8bb",
    guidDestination: "ac59473a-27f2-4be4-b71a-3000a9fbbc13",
    activeStatus: true,
  },
  {
    paymentId: 2601,
    accountNameOwner: "wellsfargo-cash_brian",
    transactionDate: "2024-09-27",
    amount: 2.0,
    guidSource: "bb3f7d2d-f5fe-4e9a-b330-7c6fc80c9d6c",
    guidDestination: "3c2f6a58-21b8-4d5e-97ba-bb28f5689fbc",
    activeStatus: true,
  },
  {
    paymentId: 2602,
    accountNameOwner: "chase_brian",
    transactionDate: "2024-09-27",
    amount: 1.5,
    guidSource: "9cb94b35-0b08-4d3b-9730-0091c1003a94",
    guidDestination: "b92f6fa2-93fa-41f4-b34f-bc4c0f75d869",
    activeStatus: true,
  },
  {
    paymentId: 2603,
    accountNameOwner: "boa_kari",
    transactionDate: "2024-09-28",
    amount: 2.0,
    guidSource: "58205a47-9f8d-44f0-b649-07b8240b92a2",
    guidDestination: "a35b4b9e-f6cc-4ad0-b535-f3a489e90262",
    activeStatus: true,
  },
  {
    paymentId: 2604,
    accountNameOwner: "citibank_brian",
    transactionDate: "2024-09-28",
    amount: 3.0,
    guidSource: "f4e15dce-cc3e-49b1-b49f-7345079db4ff",
    guidDestination: "731d0243-3f19-4298-a88d-f2ff8a5b3a44",
    activeStatus: true,
  },
  {
    paymentId: 2605,
    accountNameOwner: "rcard_brian",
    transactionDate: "2024-09-29",
    amount: 1.0,
    guidSource: "bd59ecbb-b5d1-4695-9d6e-f4df8e35fc4e",
    guidDestination: "f3855e1b-497f-4426-9185-c960f91f96a0",
    activeStatus: true,
  },
  {
    paymentId: 2606,
    accountNameOwner: "wellsfargo-cash_brian",
    transactionDate: "2024-09-29",
    amount: 2.0,
    guidSource: "a2c0d635-2459-46f7-85a1-978f34356a5b",
    guidDestination: "da416d58-3025-4310-b99b-1589cc39c9e9",
    activeStatus: true,
  },
  {
    paymentId: 2607,
    accountNameOwner: "chase_kari",
    transactionDate: "2024-09-30",
    amount: 1.5,
    guidSource: "ea7791c1-75b8-4372-b6b9-81e9c4314e5a",
    guidDestination: "872e6b79-0fdb-42ae-bc2b-d88b79fd49f2",
    activeStatus: true,
  },
  {
    paymentId: 2608,
    accountNameOwner: "boa_brian",
    transactionDate: "2024-09-30",
    amount: 2.0,
    guidSource: "8dba1997-9bb1-490a-bdd8-6f9601ecfcf6",
    guidDestination: "4853c7fc-6b60-4389-9b5a-5c68a6e9c5f7",
    activeStatus: true,
  },
];

const fetchPaymentData = async (): Promise<any> => {
  try {
    const response = await axios.get("/api/payment/select", {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    });
    // Uncomment the line below for debugging
    // console.debug(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return dataTest;
  }
};

export default function useFetchPayment() {
  return useQuery("payment", () => fetchPaymentData(), {
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
