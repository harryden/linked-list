import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { TEXT } from "@/constants/text";
import DatePickerField from "@/components/DatePickerField";
import TimePickerField from "@/components/TimePickerField";
import {
  Control,
  Controller,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { CreateEventValues } from "../schema";

interface CreateEventFormProps {
  register: UseFormRegister<CreateEventValues>;
  control: Control<CreateEventValues>;
  errors: FieldErrors<CreateEventValues>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const CreateEventForm = ({
  register,
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
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className={errors.name ? "text-destructive" : ""}
          >
            {TEXT.createEvent.form.fields.nameLabel}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={TEXT.createEvent.form.fields.namePlaceholder}
            {...register("name")}
            className={
              errors.name
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            {TEXT.createEvent.form.fields.locationLabel}
          </Label>
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

        <div className="space-y-2">
          <Label
            htmlFor="eventDate"
            className={errors.eventDate ? "text-destructive" : ""}
          >
            {TEXT.createEvent.form.fields.dateLabel}
          </Label>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DatePickerField
                id="eventDate"
                value={field.value}
                onChange={field.onChange}
                placeholder={TEXT.createEvent.form.fields.datePlaceholder}
                className={errors.eventDate ? "border-destructive" : ""}
              />
            )}
          />
          {errors.eventDate && (
            <p className="text-xs font-medium text-destructive">
              {errors.eventDate.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="startTime"
              className={errors.startTime ? "text-destructive" : ""}
            >
              {TEXT.createEvent.form.fields.startTimeLabel}
            </Label>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TimePickerField
                  id="startTime"
                  value={field.value}
                  onChange={field.onChange}
                  className={errors.startTime ? "border-destructive" : ""}
                />
              )}
            />
            {errors.startTime && (
              <p className="text-xs font-medium text-destructive">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="endTime"
              className={errors.endTime ? "text-destructive" : ""}
            >
              {TEXT.createEvent.form.fields.endTimeLabel}
            </Label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TimePickerField
                  id="endTime"
                  value={field.value}
                  onChange={field.onChange}
                  className={errors.endTime ? "border-destructive" : ""}
                />
              )}
            />
            {errors.endTime && (
              <p className="text-xs font-medium text-destructive">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="linkedinUrl"
            className={errors.linkedinUrl ? "text-destructive" : ""}
          >
            {TEXT.createEvent.form.fields.linkedinUrlLabel}
          </Label>
          <Input
            id="linkedinUrl"
            type="url"
            placeholder={TEXT.createEvent.form.fields.linkedinUrlPlaceholder}
            {...register("linkedinUrl")}
            className={
              errors.linkedinUrl
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.linkedinUrl && (
            <p className="text-xs font-medium text-destructive">
              {errors.linkedinUrl.message}
            </p>
          )}
        </div>

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
