import { QrCode, Shield, Users } from "lucide-react";

const FeaturesGrid = () => (
  <section className="py-20">
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
          <QrCode className="h-6 w-6 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">One QR Code</h3>
        <p className="text-muted-foreground">
          Generate a unique QR code for each event. Display it at your venue or
          share the link.
        </p>
      </div>

      <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">LinkedIn Verified</h3>
        <p className="text-muted-foreground">
          Authentic attendee data from LinkedIn. No fake accounts, just real
          professionals.
        </p>
      </div>

      <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Instant Lists</h3>
        <p className="text-muted-foreground">
          View who attended in real-time. Names, headlines, and profile links at
          your fingertips.
        </p>
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
