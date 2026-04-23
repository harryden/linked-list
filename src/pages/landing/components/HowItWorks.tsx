import { TEXT } from "@/constants/text";

const HowItWorks = () => {
  const steps = TEXT.landing.howItWorks.steps;

  return (
    <section className="py-24 border-t border-border-subtle bg-bg-base">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-[40px] font-semibold tracking-[-1px] text-center mb-20">
          {TEXT.landing.howItWorks.title}
        </h2>
        <div className="space-y-16">
          {steps.map(({ step, title, description }) => (
            <div
              key={step}
              className="flex flex-col md:flex-row gap-8 items-start md:items-center group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border border-primary/20 group-hover:scale-105 transition-transform">
                {step}
              </div>
              <div className="max-w-xl">
                <h3 className="text-xl font-semibold tracking-[-0.3px] mb-2">
                  {title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
