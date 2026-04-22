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
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(
      screen.getByText((content) => content.includes(TEXT.notFound.subtitle)),
    ).toBeInTheDocument();
  });

  it("renders a link back to the home page", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: new RegExp(TEXT.notFound.link, "i") });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
