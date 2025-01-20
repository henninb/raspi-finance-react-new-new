import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { basicAuth } from "../Common";

const fetchCategoryData = async (): Promise<any> => {
  try {
    const response = await axios.get("/api/category/select/active", {
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
    console.error("Error fetching category data:", error);
    return [
      {
        categoryId: Math.random(),
        categoryName: "test1",
        activeStatus: true,
      },
      {
        categoryId: Math.random(),
        categoryName: "test2",
        activeStatus: true,
      },
    ];
  }
};

export default function useFetchCategory() {
  return useQuery("category", () => fetchCategoryData(), {
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
