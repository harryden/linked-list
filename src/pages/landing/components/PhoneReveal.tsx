import phoneHandImg from "@/assets/phone-hand.png";
import PhoneScreen from "./PhoneScreen";

interface PhoneRevealProps {
  phaseA: number;
  step: 0 | 1 | 2 | 3;
}

const SCREEN_INSET = {
  top: "12%",
  left: "18%",
  width: "64%",
  height: "72%",
};

const PhoneReveal = ({ phaseA, step }: PhoneRevealProps) => {
  const translateY = (1 - phaseA) * 60;

  return (
    <div
      style={{
        position: "absolute",
        right: "5%",
        bottom: 0,
        width: "42vw",
        maxWidth: 480,
        transform: `translateY(${translateY}vh)`,
        transition: "none",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={phoneHandImg}
          alt=""
          aria-hidden="true"
          style={{ width: "100%", display: "block" }}
        />

        <div
          className="animate-color-cast"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            width: SCREEN_INSET.width,
            height: SCREEN_INSET.height,
            opacity: phaseA,
            transition: "opacity 300ms ease",
            borderRadius: "4% / 2.5%",
            overflow: "hidden",
          }}
        >
          <PhoneScreen step={step} />
        </div>
      </div>
    </div>
  );
};

export default PhoneReveal;
