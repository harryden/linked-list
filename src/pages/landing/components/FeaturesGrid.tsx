import { QrCode, Shield, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeaturesGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-bg-base rounded-xl p-8 border border-border-subtle">
          <div className="mb-4">
            <QrCode
              className="h-6 w-6 text-text-secondary"
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

        <div className="bg-bg-base rounded-xl p-8 border border-border-subtle">
          <div className="mb-4">
            <Shield
              className="h-6 w-6 text-text-secondary"
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

        <div className="bg-bg-base rounded-xl p-8 border border-border-subtle">
          <div className="mb-4">
            <Users className="h-6 w-6 text-text-secondary" aria-hidden="true" />
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
