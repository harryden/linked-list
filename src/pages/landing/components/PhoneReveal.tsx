import phoneHandImg from "@/assets/phone-hand.png";
import PhoneScreen from "./PhoneScreen";

interface PhoneRevealProps {
  phaseA: number;
  step: 0 | 1 | 2 | 3;
}

const SCREEN_INSET = {
  top: "11.5%",
  left: "41.3%",
  width: "16.27%",
  height: "62%",
};

const PhoneReveal = ({ phaseA, step }: PhoneRevealProps) => {
  const translateY = (1 - phaseA) * 35;

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        height: "90vh",
        transform: `translateY(${translateY}vh)`,
        transition: "none",
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", height: "100%" }}>
        <img
          src={phoneHandImg}
          alt=""
          aria-hidden="true"
          style={{ height: "100%", width: "auto", display: "block" }}
        />

        <div
          className="animate-color-cast-overlay"
          style={{
            position: "absolute",
            inset: 0,
            mixBlendMode: "color",
            pointerEvents: "none",
            maskImage: `url(${phoneHandImg})`,
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskImage: `url(${phoneHandImg})`,
            WebkitMaskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            width: SCREEN_INSET.width,
            height: SCREEN_INSET.height,
            borderRadius: "4% / 2.5%",
            overflow: "hidden",
          }}
        >
          <PhoneScreen step={step} contentOpacity={phaseA} />
        </div>
      </div>
    </div>
  );
};

export default PhoneReveal;
