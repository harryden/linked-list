import { useState, type FormEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CreateEventForm from "@/pages/create-event/components/CreateEventForm";
import { TEXT } from "@/constants/text";

const FormHarness = ({
  onSubmit,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => {
  const [name, setName] = useState("Launch Day");
  const [location, setLocation] = useState("Gothenburg");
  const [eventDate, setEventDate] = useState("2025-05-01");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  return (
    <CreateEventForm
      name={name}
      location={location}
      eventDate={eventDate}
      startTime={startTime}
      endTime={endTime}
      linkedinUrl={linkedinUrl}
      isSubmitting={false}
      mode="create"
      onNameChange={setName}
      onLocationChange={setLocation}
      onEventDateChange={setEventDate}
      onStartTimeChange={setStartTime}
      onEndTimeChange={setEndTime}
      onLinkedinUrlChange={setLinkedinUrl}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
    />
  );
};

describe("CreateEventForm contract", () => {
  it("surfaces the create mode copy and accessible controls", () => {
    render(
      <CreateEventForm
        name=""
        location=""
        eventDate=""
        startTime=""
        endTime=""
        linkedinUrl=""
        isSubmitting={false}
        mode="create"
        onNameChange={vi.fn()}
        onLocationChange={vi.fn()}
        onEventDateChange={vi.fn()}
        onStartTimeChange={vi.fn()}
        onEndTimeChange={vi.fn()}
        onLinkedinUrlChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: TEXT.createEvent.form.title }),
    ).toBeVisible();
    expect(
      screen.getByText(TEXT.createEvent.form.description),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: TEXT.createEvent.form.submitIdle }),
    ).toBeEnabled();
    expect(
      screen.getByLabelText(TEXT.createEvent.form.fields.nameLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        TEXT.createEvent.form.fields.locationPlaceholder,
      ),
    ).toBeInTheDocument();
    const dateButton = screen.getByRole("button", {
      name: TEXT.createEvent.form.fields.dateLabel,
    });
    expect(dateButton).toBeInTheDocument();
    expect(dateButton).toHaveTextContent(/select date/i);
  });

  it("switches copy in edit mode and locks the submit action when loading", () => {
    render(
      <CreateEventForm
        name="Edited name"
        location="Edited location"
        eventDate="2025-05-01"
        startTime="09:00"
        endTime="11:00"
        linkedinUrl="https://example.com"
        isSubmitting
        mode="edit"
        onNameChange={vi.fn()}
        onLocationChange={vi.fn()}
        onEventDateChange={vi.fn()}
        onStartTimeChange={vi.fn()}
        onEndTimeChange={vi.fn()}
        onLinkedinUrlChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: TEXT.createEvent.form.editTitle }),
    ).toBeVisible();
    expect(
      screen.getByText(TEXT.createEvent.form.editDescription),
    ).toBeInTheDocument();

    const submit = screen.getByRole("button", {
      name: TEXT.createEvent.form.editSubmitLoading,
    });

    expect(submit).toBeDisabled();
  });

  it("wires value updates and submit handling through the provided callbacks", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<FormHarness onSubmit={onSubmit} />);

    await user.clear(
      screen.getByLabelText(TEXT.createEvent.form.fields.nameLabel),
    );
    await user.type(
      screen.getByLabelText(TEXT.createEvent.form.fields.nameLabel),
      "Weekend Launch",
    );
    await user.clear(
      screen.getByPlaceholderText(
        TEXT.createEvent.form.fields.locationPlaceholder,
      ),
    );
    await user.type(
      screen.getByPlaceholderText(
        TEXT.createEvent.form.fields.locationPlaceholder,
      ),
      "Gothenburg",
    );

    await user.click(
      screen.getByRole("button", {
        name: TEXT.createEvent.form.submitIdle,
      }),
    );

    expect(screen.getByDisplayValue("Weekend Launch")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Gothenburg")).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
