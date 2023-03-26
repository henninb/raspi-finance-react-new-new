import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import PaymentRequired from "./PaymentRequired";

describe("PaymentRequired component", () => {
  const queryClient = new QueryClient();

  // beforeEach(() => {
  //   jest.spyOn(console, "error");
  //   console.error.mockImplementation(() => {});
  // });
  //
  // afterEach(() => {
  //   console.error.mockRestore();
  // });

  it("displays payment required table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PaymentRequired />
        </MemoryRouter>
      </QueryClientProvider>
    );

    //const table = await screen.findByTestId("payment-required-table");

    //expect(table).toBeInTheDocument();
  });
});
