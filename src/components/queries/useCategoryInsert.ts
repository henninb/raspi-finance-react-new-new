import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const insertCategory = async (categoryName: any): Promise<any> => {
  try {
    const endpoint = "/api/category/insert";
    const payload = { category: categoryName, activeStatus: true };

    const response = await axios.post(endpoint, payload, {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(),
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        console.error("Resource not found (404).", error.response.data);
        // React to 404 specifically
        return {
          categoryId: Math.random(),
          categoryName: categoryName,
          activeStatus: true,
          dateAdded: new Date(),
          dateUpdated: new Date(),
        };
      }
    }
  }
};

export default function useCategoryInsert() {
  const queryClient = useQueryClient();

  return useMutation(
    ["insertCategory"],
    (variables: any) => insertCategory(variables.categoryName),
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

      onSuccess: (response) => {
        const oldData: any = queryClient.getQueryData("category");
        const newData = [response, ...oldData];
        queryClient.setQueryData("category", newData);
      },
    },
  );
}
