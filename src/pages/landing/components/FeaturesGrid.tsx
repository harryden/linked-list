import { useTranslation } from "react-i18next";

const FeaturesGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-4xl grid md:grid-cols-2 gap-px bg-border">
        <div className="bg-background p-10">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            {t("landing.features.oneQrCode.title")}
          </p>
          <p className="text-2xl md:text-3xl font-display font-black tracking-tight leading-tight">
            {t("landing.features.oneQrCode.description")}
          </p>
        </div>
        <div className="bg-background p-10">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            {t("landing.features.linkedinVerified.title")}
          </p>
          <p className="text-2xl md:text-3xl font-display font-black tracking-tight leading-tight">
            {t("landing.features.linkedinVerified.description")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
