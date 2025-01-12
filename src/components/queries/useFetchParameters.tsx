import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

//const dataTest = [{parameterName: "payment_account", parameterValue: "wfargo_brian"}]

const fetchParameterData = async (): Promise<any> => {
  try {
    const response = await axios.get("/api/parm/select/active", {
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
    console.error("Error fetching parameters data:", error);
    return [{
      parameterId: Math.random(),
      parameterName: "payment_account", 
      parameterValue: "wfargo_brian"
    }]
  }
};

export default function useFetchParameter() {
  return useQuery("parameter", () => fetchParameterData(), {
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
