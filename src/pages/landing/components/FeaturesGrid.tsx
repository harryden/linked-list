const FEATURES = [
  {
    n: "01",
    t: "LinkedIn Check-In",
    d: "Attendees scan a QR code and check in with one tap using their LinkedIn profile. No forms required.",
  },
  {
    n: "02",
    t: "Live Attendee Roster",
    d: "Instantly see everyone who has checked in. View names, headlines, and professional profiles in real-time.",
  },
  {
    n: "03",
    t: "Organizer Export",
    d: "Keep your event data organized. Download the full attendee list as a clean, CSV file whenever you need.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="px-16 pt-24 pb-16 max-md:px-4 max-md:pt-16">
      <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 border-t border-border-subtle pt-16">
        {FEATURES.map((f) => (
          <div key={f.n}>
            <div className="text-[11px] font-mono text-text-secondary tracking-[1px]">
              {f.n}
            </div>
            <div className="text-lg font-medium mt-2.5 tracking-[-0.2px]">
              {f.t}
            </div>
            <div className="text-sm text-text-secondary mt-2 leading-relaxed">
              {f.d}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
