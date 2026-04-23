import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = "/",
    initialEntries,
  }: {
    route?: string;
    initialEntries?: Array<string | { pathname: string; state?: object }>;
  } = {},
) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <MemoryRouter initialEntries={initialEntries || [route]}>
      <QueryClientProvider client={qc}>
        <TooltipProvider>
          {ui}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
