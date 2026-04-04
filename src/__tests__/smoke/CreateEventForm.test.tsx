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
import { screen, waitFor } from "@testing-library/react";
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
});
