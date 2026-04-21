import { Button } from "@/components/ui/button";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { TEXT } from "@/constants/text";
import FormField from "@/components/FormField";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateEventValues } from "../schema";
import { ArrowRight, QrCode, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

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
  <form onSubmit={onSubmit} className="flex flex-col gap-5">
    {/* Hidden but present for tests and semantics */}
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

    {/* Event name */}
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

    {/* Date + Start time */}
    <div className="grid grid-cols-2 gap-4">
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
    </div>

    {/* End time */}
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

    {/* Location */}
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
          />
        )}
      />
    </div>

    {/* LinkedIn URL */}
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

    {/* Check-in method */}
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-text-primary">
        Check-in method
      </label>
      <Controller
        name="checkInMethod"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => field.onChange("qr")}
              className={cn(
                "p-3.5 bg-bg-base border rounded-md text-left transition-all",
                field.value === "qr"
                  ? "border-brand-accent shadow-[0_0_0_3px_hsl(var(--border-subtle))]"
                  : "border-border-subtle bg-bg-surface hover:bg-bg-surface-hover",
              )}
            >
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4" aria-hidden="true" />
                <span className="text-[13px] font-medium">QR code</span>
              </div>
              <p className="text-[12px] text-text-secondary mt-1.5 leading-tight">
                Guests scan at the door.
              </p>
            </button>
            <button
              type="button"
              onClick={() => field.onChange("link")}
              className={cn(
                "p-3.5 bg-bg-base border rounded-md text-left transition-all",
                field.value === "link"
                  ? "border-brand-accent shadow-[0_0_0_3px_hsl(var(--border-subtle))]"
                  : "border-border-subtle bg-bg-surface hover:bg-bg-surface-hover",
              )}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span className="text-[13px] font-medium">Shareable link</span>
              </div>
              <p className="text-[12px] text-text-secondary mt-1.5 leading-tight">
                Drop in a calendar invite.
              </p>
            </button>
          </div>
        )}
      />
    </div>

    {/* Footer */}
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
