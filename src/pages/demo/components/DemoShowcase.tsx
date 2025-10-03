import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, Check } from "lucide-react";

const DemoShowcase = () => (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
            1
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">
              Organizer Creates Event
            </CardTitle>
            <CardDescription className="text-base">
              Sign up as an organizer, create your event with a name and optional
              details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-20">
        <div className="bg-muted p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            <span>Enter event name: "Tech Meetup 2025"</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            <span>Set date and time (optional)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            <span>Add LinkedIn event URL (optional)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            <span>Get unique QR code instantly</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
            2
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">Display QR Code</CardTitle>
            <CardDescription className="text-base">
              Print the QR code or display it digitally at your event entrance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-20">
        <div className="bg-muted p-6 rounded-xl">
          <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl inline-block shadow-md">
              <QrCode className="h-32 w-32 text-primary" />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Each event gets a unique QR code
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
            3
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">Attendees Check In</CardTitle>
            <CardDescription className="text-base">
              Guests scan the QR code with their phone and authenticate with
              LinkedIn
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-20">
        <div className="bg-muted p-6 rounded-xl space-y-4">
          <div className="space-y-2">
            <p className="font-medium">⚠️ Privacy Notice Shown:</p>
            <div className="bg-background/80 p-4 rounded-lg border border-border">
              <p className="text-sm">
                "Your LinkedIn name and headline will be shown to other
                attendees of this event."
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-success">
            <Check className="h-5 w-5" />
            <span className="font-medium">Attendance recorded automatically</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
            4
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">View Attendee List</CardTitle>
            <CardDescription className="text-base">
              Organizers and attendees can see the verified list of who's at the
              event
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-20">
        <div className="bg-muted p-6 rounded-xl">
          <div className="space-y-3">
            {[
              {
                name: "Sarah Johnson",
                title: "Senior Product Manager at Tech Corp",
              },
              {
                name: "Michael Chen",
                title: "Software Engineer at StartupXYZ",
              },
              {
                name: "Emma Davis",
                title: "UX Designer at Creative Studio",
              },
            ].map((person, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-background p-4 rounded-lg border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                  {person.name.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DemoShowcase;
