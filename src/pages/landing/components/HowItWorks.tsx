import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = t("landing.howItWorks.steps", { returnObjects: true }) as any[];

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-none mb-16">
          {t("landing.howItWorks.title")}
        </h2>
        <div className="space-y-0 divide-y divide-border">
          {steps.map(({ step, title, description }) => (
            <div key={step} className="flex gap-8 py-8 items-start">
              <span className="flex-shrink-0 font-mono text-sm text-muted-foreground w-6 pt-1">
                {step}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
