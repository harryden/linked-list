import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateEventForm from "@/pages/create-event/components/CreateEventForm";
import {
  createEventSchema,
  type CreateEventValues,
} from "@/pages/create-event/schema";
import { TEXT } from "@/constants/text";

const defaultValues: CreateEventValues = {
  name: "",
  location: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  linkedinUrl: "",
};

const FormHarness = ({
  initialValues = defaultValues,
  isSubmitting = false,
  mode = "create" as const,
  onSubmit = vi.fn(),
}: {
  initialValues?: Partial<CreateEventValues>;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onSubmit?: ReturnType<typeof vi.fn>;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  return (
    <CreateEventForm
      register={register}
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      mode={mode}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

describe("CreateEventForm contract", () => {
  it("surfaces the create mode copy and accessible controls", () => {
    render(<FormHarness />);

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
  });

  it("switches copy in edit mode and locks the submit action when loading", () => {
    render(
      <FormHarness
        initialValues={{
          name: "Edited name",
          location: "Edited location",
          eventDate: "2025-05-01",
          startTime: "09:00",
          endTime: "11:00",
          linkedinUrl: "https://example.com",
        }}
        isSubmitting
        mode="edit"
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

  it("calls onSubmit with valid form values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <FormHarness
        initialValues={{
          name: "Weekend Launch",
          location: "Gothenburg",
          eventDate: "2025-05-10",
          startTime: "10:00",
          endTime: "12:00",
        }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: TEXT.createEvent.form.submitIdle }),
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
