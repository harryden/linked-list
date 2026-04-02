import DemoHeader from "./demo/components/DemoHeader";
import DemoShowcase from "./demo/components/DemoShowcase";
import DemoNotes from "./demo/components/DemoNotes";
import PageContainer from "@/components/layout/PageContainer";

const Demo = () => {
  return (
    <PageContainer maxWidth="lg" className="pt-0 pb-12">
      <DemoHeader />
      <div className="space-y-12 mt-12">
        <DemoShowcase />
        <DemoNotes />
      </div>
    </PageContainer>
  );
};

export default Demo;
