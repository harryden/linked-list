import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

const GradientBackground = () => (
  <div className="fixed inset-0 z-0" aria-hidden="true">
    <ShaderGradientCanvas style={{ width: "100%", height: "100%" }}>
      <ShaderGradient
        animate="on"
        type="waterPlane"
        uSpeed={0.2}
        uStrength={2.4}
        uDensity={0.7}
        color1="#5606ff"
        color2="#fe8989"
        color3="#000000"
        cDistance={3.91}
        cPolarAngle={115}
        cAzimuthAngle={180}
        rotationZ={235}
        brightness={1.1}
        grain="off"
        lightType="3d"
        envPreset="city"
        reflection={0.1}
      />
    </ShaderGradientCanvas>
  </div>
);

export default GradientBackground;
