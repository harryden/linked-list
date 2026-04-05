import { QrCode, Shield, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeaturesGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
            <QrCode
              className="h-6 w-6 text-accent-foreground"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("landing.features.oneQrCode.title")}
          </h3>
          <p className="text-muted-foreground">
            {t("landing.features.oneQrCode.description")}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
            <Shield
              className="h-6 w-6 text-accent-foreground"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("landing.features.linkedinVerified.title")}
          </h3>
          <p className="text-muted-foreground">
            {t("landing.features.linkedinVerified.description")}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
            <Users
              className="h-6 w-6 text-accent-foreground"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("landing.features.instantLists.title")}
          </h3>
          <p className="text-muted-foreground">
            {t("landing.features.instantLists.description")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
