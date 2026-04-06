import { useNavigate } from "react-router-dom";
import PhoneStatusBar from "./PhoneStatusBar";
import QRCodePreview from "@/components/QRCodePreview";

const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

const ATTENDEES = [
  {
    name: "Alex Johnson",
    role: "Product Designer · Spotify",
    color: "linear-gradient(135deg,#5606ff,#fe8989)",
  },
  {
    name: "Maria Chen",
    role: "Engineering Lead · Figma",
    color: "linear-gradient(135deg,#0a66c2,#38bdf8)",
  },
  {
    name: "Sam Rivera",
    role: "Founder · Seed stage",
    color: "linear-gradient(135deg,#fe8989,#ff6b6b)",
  },
];

const StepBlank = () => <div style={{ flex: 1, background: "#fff" }} />;

const StepQR = () => (
  <div
    style={{
      flex: 1,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "12px 16px",
      fontFamily: IOS_FONT,
    }}
  >
    <span
      style={{
        fontSize: 8,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#999",
        alignSelf: "flex-start",
      }}
    >
      Check in
    </span>
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 10,
        padding: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <QRCodePreview
        value="https://linkback.app/auth"
        size={90}
        className="!p-0 !shadow-none !rounded-none !bg-transparent"
        imageClassName="!h-[90px] !w-[90px]"
      />
    </div>
    <span style={{ fontSize: 9.5, fontWeight: 700, color: "#111" }}>
      Scan to sign in
    </span>
    <span style={{ fontSize: 8, color: "#aaa" }}>linkback.app/auth</span>
  </div>
);

const StepAttendees = () => (
  <div
    style={{
      flex: 1,
      background: "#f7f7f8",
      display: "flex",
      flexDirection: "column",
      fontFamily: IOS_FONT,
      overflowY: "hidden",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "8px 12px 6px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 800,
          color: "#111",
          letterSpacing: "-0.02em",
        }}
      >
        Stockholm Tech Meetup
      </div>
      <div style={{ fontSize: 7.5, color: "#999" }}>
        Tue 6 May · Stureplan 4
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "#111",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        24
      </span>
      <span style={{ fontSize: 8, color: "#aaa", lineHeight: 1.2 }}>
        checked
        <br />
        in
      </span>
    </div>
    <div
      style={{
        fontSize: 7.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#aaa",
        padding: "0 12px 4px",
      }}
    >
      Attendees
    </div>
    {ATTENDEES.map(({ name, role, color }) => (
      <div
        key={name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px",
          background: "#fff",
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 8.5,
              fontWeight: 700,
              color: "#111",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 7,
              color: "#aaa",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {role}
          </div>
        </div>
        <div
          style={{
            width: 14,
            height: 14,
            background: "#0a66c2",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 6,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          in
        </div>
      </div>
    ))}
    <div style={{ padding: "5px 12px", fontSize: 7.5, color: "#ccc" }}>
      +21 more attendees
    </div>
  </div>
);

const StepCTA = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 16,
        fontFamily: IOS_FONT,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "#111",
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
        }}
      >
        Host smarter
        <br />
        events.
      </div>
      <div
        style={{
          fontSize: 8.5,
          color: "#999",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 110,
        }}
      >
        LinkedIn-verified check-ins. Real profiles. No fake attendees.
      </div>
      <div
        onClick={() => navigate("/auth")}
        style={{
          background: "linear-gradient(135deg,#5606ff,#8b35ff)",
          color: "#fff",
          fontSize: 9,
          fontWeight: 700,
          padding: "8px 18px",
          borderRadius: 24,
          letterSpacing: "-0.01em",
          boxShadow: "0 4px 16px rgba(86,6,255,0.4)",
          cursor: "pointer",
        }}
      >
        Get started free
      </div>
      <div
        onClick={() =>
          document
            .querySelector("#how-it-works")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          fontSize: 8,
          color: "#bbb",
          textDecoration: "underline",
          textUnderlineOffset: 2,
          cursor: "pointer",
        }}
      >
        See how it works →
      </div>
    </div>
  );
};

const STEPS = [StepBlank, StepQR, StepAttendees, StepCTA];

interface PhoneScreenProps {
  step: 0 | 1 | 2 | 3;
  contentOpacity?: number;
}

const PhoneScreen = ({ step, contentOpacity = 1 }: PhoneScreenProps) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 30,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <PhoneStatusBar />
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          opacity: contentOpacity,
          transition: "opacity 300ms ease",
        }}
      >
        {STEPS.map((Step, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              transform: `translateY(${i < step ? "-100%" : i > step ? "100%" : "0%"})`,
              opacity: i === step ? 1 : 0.3,
              transition:
                "transform 1100ms cubic-bezier(0.4,0,0.2,1), opacity 1100ms ease",
              pointerEvents: i === step ? "auto" : "none",
            }}
          >
            <Step />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneScreen;
