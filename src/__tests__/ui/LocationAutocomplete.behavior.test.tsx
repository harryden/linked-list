import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";

const AutocompleteHarness = ({
  onChange,
}: {
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState("");

  return (
    <label className="block space-y-2">
      <span>Location</span>
      <LocationAutocomplete
        id="location"
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
      />
    </label>
  );
};

describe("LocationAutocomplete behavior", () => {
  it("debounces lookups and surfaces MSW-backed suggestions", async () => {
    const user = userEvent.setup();

    render(<AutocompleteHarness />);

    await user.type(screen.getByLabelText(/location/i), "Got");

    expect(
      await screen.findByRole("button", {
        name: /gothenburg, sweden/i,
      }),
    ).toBeInTheDocument();
  });

  it("allows keyboard users to select a suggestion and updates the input value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<AutocompleteHarness onChange={onChange} />);

    const input = screen.getByLabelText(/location/i);

    await user.type(input, "Goth");

    const options = await screen.findAllByRole("button", {
      name: /sweden/i,
    });

    await user.tab();
    expect(document.activeElement).toBe(options[0]);

    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(input).toHaveValue("Gothenburg, Sweden");
    });

    expect(onChange).toHaveBeenCalledWith("Gothenburg, Sweden");
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /gothenburg, sweden/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("clears stale suggestions when the fetch is aborted", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness />);
    const input = screen.getByLabelText(/location/i);

    // Show suggestions first so there is something to clear
    await user.type(input, "Goth");
    await screen.findByRole("button", { name: /gothenburg, sweden/i });

    // Next request aborts immediately (simulates the 5 s timeout firing)
    vi.spyOn(window, "fetch").mockRejectedValueOnce(
      new DOMException("The operation was aborted", "AbortError"),
    );

    await user.type(input, "enburg");

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /gothenburg, sweden/i }),
      ).not.toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("clears suggestions when the query becomes too short", async () => {
    const user = userEvent.setup();

    render(<AutocompleteHarness />);

    const input = screen.getByLabelText(/location/i);

    await user.type(input, "Goth");
    await screen.findByRole("button", { name: /gothenburg, sweden/i });

    await user.clear(input);
    await user.type(input, "Go");

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /gothenburg, sweden/i }),
      ).not.toBeInTheDocument();
    });
  });
});
