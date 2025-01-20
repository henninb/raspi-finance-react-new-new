import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const dataTest = [
  { parameterName: "payment_account", parameterValue: "wfargo_brian" },
];

const fetchParameterData = async (parameterName: any): Promise<any> => {
  try {
    const response = await axios.get(`/api/parm/select/${parameterName}`, {
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
    console.error("Error fetching parameter data:", error);
    return dataTest;
  }
};

export default function useFetchParameter(parameterName: any) {
  return useQuery(
    ["parameter", parameterName],
    () => fetchParameterData(parameterName),
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
