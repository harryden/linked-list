const FEATURES = [
  {
    n: "01",
    t: "Scan, check in, connect.",
    d: "Guests tap a QR at the door. Their LinkedIn imports in one step. No app required.",
  },
  {
    n: "02",
    t: "A real-time attendee graph.",
    d: "See who else is in the room, what they do, and who you already know in common.",
  },
  {
    n: "03",
    t: "Portable follow-up.",
    d: "Attendees leave with a roster they own. Organizers keep a clean CRM-ready export.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="px-16 pt-24 pb-16 max-md:px-4 max-md:pt-16">
      <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
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
