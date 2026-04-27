import { Button } from "@/components/ui/button";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { TEXT } from "@/constants/text";
import FormField from "@/components/FormField";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateEventValues } from "../schema";
import { ArrowRight } from "lucide-react";

interface CreateEventFormProps {
  control: Control<CreateEventValues>;
  errors: FieldErrors<CreateEventValues>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel?: () => void;
}

const CreateEventForm = ({
  control,
  errors,
  isSubmitting,
  mode = "create",
  onSubmit,
  onCancel,
}: CreateEventFormProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
    <div className="sr-only">
      <h1>
        {mode === "edit"
          ? TEXT.createEvent.form.editTitle
          : TEXT.createEvent.form.title}
      </h1>
      <p>
        {mode === "edit"
          ? TEXT.createEvent.form.editDescription
          : TEXT.createEvent.form.description}
      </p>
    </div>

    <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-[13px] font-medium text-text-primary"
          >
            {TEXT.createEvent.form.fields.nameLabel}
          </label>
          <FormField
            id="name"
            label=""
            placeholder={TEXT.createEvent.form.fields.namePlaceholder}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errors.name?.message}
          />
        </div>
      )}
    />

    <Controller
      name="eventDate"
      control={control}
      render={({ field }) => (
        <FormField
          id="eventDate"
          type="date"
          label={TEXT.createEvent.form.fields.dateLabel}
          placeholder={TEXT.createEvent.form.fields.datePlaceholder}
          value={field.value}
          onChange={field.onChange}
          ref={field.ref}
          error={errors.eventDate?.message}
        />
      )}
    />

    <div className="grid grid-cols-2 gap-4">
      <Controller
        name="startTime"
        control={control}
        render={({ field }) => (
          <FormField
            id="startTime"
            type="time"
            label={TEXT.createEvent.form.fields.startTimeLabel}
            value={field.value}
            onChange={field.onChange}
            ref={field.ref}
            error={errors.startTime?.message}
          />
        )}
      />

      <Controller
        name="endTime"
        control={control}
        render={({ field }) => (
          <FormField
            id="endTime"
            type="time"
            label={TEXT.createEvent.form.fields.endTimeLabel}
            value={field.value}
            onChange={field.onChange}
            ref={field.ref}
            error={errors.endTime?.message}
          />
        )}
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="location"
        className="text-[13px] font-medium text-text-primary"
      >
        {TEXT.createEvent.form.fields.locationLabel}
      </label>
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <LocationAutocomplete
            id="location"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder={TEXT.createEvent.form.fields.locationPlaceholder}
            required
            error={errors.location?.message}
          />
        )}
      />
    </div>

    <Controller
      name="linkedinUrl"
      control={control}
      render={({ field }) => (
        <FormField
          id="linkedinUrl"
          type="url"
          label={TEXT.createEvent.form.fields.linkedinUrlLabel}
          placeholder={TEXT.createEvent.form.fields.linkedinUrlPlaceholder}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          error={errors.linkedinUrl?.message}
        />
      )}
    />

    <div className="mt-5 pt-5 border-t border-border-subtle flex items-center justify-end gap-3">
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          size="xl"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {TEXT.common.buttons.cancel}
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        size="xl"
        disabled={isSubmitting}
        className="gap-2"
      >
        {isSubmitting
          ? mode === "edit"
            ? TEXT.createEvent.form.editSubmitLoading
            : TEXT.createEvent.form.submitLoading
          : mode === "edit"
            ? TEXT.createEvent.form.editSubmitIdle
            : TEXT.createEvent.form.submitIdle}
        {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
      </Button>
    </div>
  </form>
);

export default CreateEventForm;
