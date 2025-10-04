import { TEXT } from "@/constants/text";

const HowItWorks = () => (
  <section className="py-20">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        {TEXT.landing.howItWorks.title}
      </h2>
      <div className="space-y-12">
        {TEXT.landing.howItWorks.steps.map(
          ({ step, title, description }, index) => (
            <div
              key={step}
              className="flex flex-col md:flex-row gap-6 items-center animate-fade-in"
              style={{
                animationDelay: `${0.1 + index * 0.2}s`,
                animationFillMode: "both",
              }}
            >
              <div
                className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold"
                style={{ boxShadow: "0 0 20px rgba(255, 150, 200, 0.4)" }}
              >
                {step}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  </section>
);

export default HowItWorks;
