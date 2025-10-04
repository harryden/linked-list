import { FormEvent } from "react";
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

interface CreateEventFormProps {
  name: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  linkedinUrl: string;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  onNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onLinkedinUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CreateEventForm = ({
  name,
  location,
  eventDate,
  startTime,
  endTime,
  linkedinUrl,
  isSubmitting,
  mode = "create",
  onNameChange,
  onLocationChange,
  onEventDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onLinkedinUrlChange,
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
          <Label htmlFor="name">{TEXT.createEvent.form.fields.nameLabel}</Label>
          <Input
            id="name"
            type="text"
            placeholder={TEXT.createEvent.form.fields.namePlaceholder}
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{TEXT.createEvent.form.fields.locationLabel}</Label>
          <LocationAutocomplete
            id="location"
            value={location}
            onChange={onLocationChange}
            placeholder={TEXT.createEvent.form.fields.locationPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date">{TEXT.createEvent.form.fields.dateLabel}</Label>
          <DatePickerField
            id="event_date"
            value={eventDate}
            onChange={onEventDateChange}
            placeholder={TEXT.createEvent.form.fields.datePlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">{TEXT.createEvent.form.fields.startTimeLabel}</Label>
          <TimePickerField
            id="start_time"
            value={startTime}
            onChange={onStartTimeChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">{TEXT.createEvent.form.fields.endTimeLabel}</Label>
          <TimePickerField id="end_time" value={endTime} onChange={onEndTimeChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">
            {TEXT.createEvent.form.fields.linkedinUrlLabel}
          </Label>
          <Input
            id="linkedin_url"
            type="url"
            placeholder={TEXT.createEvent.form.fields.linkedinUrlPlaceholder}
            value={linkedinUrl}
            onChange={(event) => onLinkedinUrlChange(event.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-full h-12 text-base font-medium"
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
