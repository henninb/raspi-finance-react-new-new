import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { basicAuth } from "../Common";

const dataTest = [{}]

const fetchDescriptionData = async (): Promise<any> => {
  try {
  const response = await axios.get("/api/description/select/all", {
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
  console.error("Error fetching description data:", error);
  return dataTest;
}
};

export default function useFetchDescription() {
  return useQuery("description", () => fetchDescriptionData(), {
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
