import React from "react";
import { vi } from "vitest";

vi.mock("@/components/FormField", () => ({
  default: React.forwardRef<
    HTMLInputElement,
    {
      label?: string;
      value: string;
      onChange: (val: string) => void;
      type?: string;
      placeholder?: string;
      id?: string;
      error?: string;
    }
  >(
    (
      { label, value, onChange, type, placeholder, id, error, ...props },
      ref,
    ) => (
      <div data-testid={`field-${id}`}>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          id={id}
          type={type === "date" || type === "time" ? type : "text"}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />
        {error && <div role="alert">{error}</div>}
      </div>
    ),
  ),
}));

import { renderWithProviders } from "@/test-utils/render";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateEvent from "@/pages/CreateEvent";
import { TEXT } from "@/constants/text";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

const renderCreateEvent = () => {
  const query = createQueryStub({
    singleResult: {
      data: {
        id: "event-1",
        slug: "weekend-mvp-launch-abc123",
        organizer_id: "user_test",
      },
      error: null,
    },
  });
  query.insert = vi.fn().mockReturnValue(query);
  query.select = vi.fn().mockReturnValue(query);
  supabaseStub.from.mockImplementation(() => query);

  return renderWithProviders(
    <Routes>
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/event-success/:slug" element={<div />} />
    </Routes>,
    { route: "/create-event" },
  );
};

describe("CreateEvent smoke", () => {
  it("submits when form is valid and surfaces the success toast", async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), "Weekend MVP Launch");
    await user.type(screen.getByLabelText(/location/i), "Gothenburg, Sweden");
    await user.type(screen.getByLabelText(/event date/i), "2025-05-10");
    await user.type(screen.getByLabelText(/start time/i), "10:00");
    await user.type(screen.getByLabelText(/end time/i), "12:00");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.createEvent.form.submitIdle, "i"),
      }),
    );

    expect(
      await screen.findByText(TEXT.createEvent.toast.success),
    ).toBeInTheDocument();
  });

  it("surfaces validation feedback when the time range is invalid", async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), "Weekend MVP Launch");
    await user.type(screen.getByLabelText(/location/i), "Gothenburg, Sweden");
    await user.type(screen.getByLabelText(/event date/i), "2025-05-10");
    await user.type(screen.getByLabelText(/start time/i), "12:00");
    await user.type(screen.getByLabelText(/end time/i), "12:00");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.createEvent.form.submitIdle, "i"),
      }),
    );

    expect(
      await screen.findByText(TEXT.createEvent.toast.invalidTimeRange),
    ).toBeInTheDocument();
  });

  it("surfaces validation feedback when location is missing", async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), "Weekend MVP Launch");
    await user.type(screen.getByLabelText(/event date/i), "2025-05-10");
    await user.type(screen.getByLabelText(/start time/i), "10:00");
    await user.type(screen.getByLabelText(/end time/i), "12:00");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.createEvent.form.submitIdle, "i"),
      }),
    );

    expect(
      await screen.findByText(TEXT.createEvent.toast.missingLocation),
    ).toBeInTheDocument();
  });

  it("surfaces validation feedback when location is only whitespace", async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), "Weekend MVP Launch");
    await user.type(screen.getByLabelText(/location/i), "   ");
    await user.type(screen.getByLabelText(/event date/i), "2025-05-10");
    await user.type(screen.getByLabelText(/start time/i), "10:00");
    await user.type(screen.getByLabelText(/end time/i), "12:00");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.createEvent.form.submitIdle, "i"),
      }),
    );

    expect(
      await screen.findByText(TEXT.createEvent.toast.missingLocation),
    ).toBeInTheDocument();
  });

  it("allows events to run past midnight (Midnight Boundary Bug)", async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), "Late Night Party");
    await user.type(screen.getByLabelText(/location/i), "Gothenburg, Sweden");
    await user.type(screen.getByLabelText(/event date/i), "2025-05-10");
    await user.type(screen.getByLabelText(/start time/i), "22:00");
    await user.type(screen.getByLabelText(/end time/i), "02:00");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.createEvent.form.submitIdle, "i"),
      }),
    );

    // This should NOT show an invalid time range toast
    expect(
      screen.queryByText(TEXT.createEvent.toast.invalidTimeRange),
    ).not.toBeInTheDocument();

    expect(
      await screen.findByText(TEXT.createEvent.toast.success),
    ).toBeInTheDocument();
  });

  it("does not submit the form if no changes were made (Pristine Form)", async () => {
    const user = userEvent.setup();

    // Re-render with mocked update mutation to track calls
    vi.mocked(supabaseStub.from).mockImplementation(() => {
      const query = createQueryStub({
        singleResult: {
          data: {
            id: "event-1",
            name: "Original Name",
            location: "Original Location",
            starts_at: "2025-05-10T10:00:00.000Z",
            ends_at: "2025-05-10T12:00:00.000Z",
            linkedin_event_url: "",
          },
          error: null,
        },
      });
      return query;
    });

    renderWithProviders(<CreateEvent />, {
      initialEntries: [
        { pathname: "/create-event", state: { eventId: "event-1" } },
      ],
    });

    // Wait for form to prefill
    await screen.findByDisplayValue("Original Name");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.createEvent.form.editSubmitIdle, "i"),
      }),
    );

    // Should show a "No changes" toast instead of success
    expect(
      await screen.findByText(TEXT.event.toast.noChanges),
    ).toBeInTheDocument();
  });
});
