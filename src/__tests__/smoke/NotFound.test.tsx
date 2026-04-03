import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { TEXT } from "@/constants/text";

describe("NotFound smoke", () => {
  it("renders the 404 title", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      TEXT.notFound.title,
    );
  });

  it("renders the subtitle", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByText(TEXT.notFound.subtitle)).toBeInTheDocument();
  });

  it("renders a link back to the home page", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: TEXT.notFound.link });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
