import DemoHeader from "./demo/components/DemoHeader";
import DemoShowcase from "./demo/components/DemoShowcase";
import DemoNotes from "./demo/components/DemoNotes";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DemoHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <DemoShowcase />
          <DemoNotes />
        </div>
      </main>
    </div>
  );
};

export default Demo;
