import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { TEXT } from "@/constants/text";
import FormField from "@/components/FormField";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateEventValues } from "../schema";

interface CreateEventFormProps {
  control: Control<CreateEventValues>;
  errors: FieldErrors<CreateEventValues>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const CreateEventForm = ({
  control,
  errors,
  isSubmitting,
  mode = "create",
  onSubmit,
}: CreateEventFormProps) => (
  <Card className="shadow-xl">
    <CardHeader>
      <CardTitle className="text-3xl">
        {mode === "edit"
          ? TEXT.createEvent.form.editTitle
          : TEXT.createEvent.form.title}
      </CardTitle>
      <CardDescription>
        {mode === "edit"
          ? TEXT.createEvent.form.editDescription
          : TEXT.createEvent.form.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-8">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormField
              id="name"
              label={TEXT.createEvent.form.fields.nameLabel}
              placeholder={TEXT.createEvent.form.fields.namePlaceholder}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.name?.message}
            />
          )}
        />

        <div className="space-y-2">
          <label
            htmlFor="location"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        <Button
          type="submit"
          className="w-full rounded-full h-12 text-base font-medium shadow-glow-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === "edit"
              ? TEXT.createEvent.form.editSubmitLoading
              : TEXT.createEvent.form.submitLoading
            : mode === "edit"
              ? TEXT.createEvent.form.editSubmitIdle
              : TEXT.createEvent.form.submitIdle}
        </Button>
      </form>
    </CardContent>
  </Card>
);

export default CreateEventForm;
