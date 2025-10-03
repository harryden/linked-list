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

interface CreateEventFormProps {
  name: string;
  location: string;
  startsAt: string;
  linkedinUrl: string;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onStartsAtChange: (value: string) => void;
  onLinkedinUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CreateEventForm = ({
  name,
  location,
  startsAt,
  linkedinUrl,
  isSubmitting,
  onNameChange,
  onLocationChange,
  onStartsAtChange,
  onLinkedinUrlChange,
  onSubmit,
}: CreateEventFormProps) => (
  <Card className="shadow-xl">
    <CardHeader>
      <CardTitle className="text-3xl">Create New Event</CardTitle>
      <CardDescription>
        Fill in the details below to generate your event QR code
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Summer Tech Meetup 2025"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <LocationAutocomplete
            id="location"
            value={location}
            onChange={onLocationChange}
            placeholder="TechHub Conference Center, San Francisco"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="starts_at">Start Date & Time</Label>
          <Input
            id="starts_at"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => onStartsAtChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn Event URL (optional)</Label>
          <Input
            id="linkedin_url"
            type="url"
            placeholder="https://www.linkedin.com/events/..."
            value={linkedinUrl}
            onChange={(event) => onLinkedinUrlChange(event.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-full h-12 text-base font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Event..." : "Create Event & Generate QR Code"}
        </Button>
      </form>
    </CardContent>
  </Card>
);

export default CreateEventForm;
