import { TEXT } from "@/constants/text";
import PageContainer from "@/components/layout/PageContainer";

const EventLoading = () => (
  <PageContainer className="items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-[2px] bg-border-subtle overflow-hidden mx-auto mb-4">
        <div className="w-full h-full bg-text-primary animate-loader-slide"></div>
      </div>
      <p className="text-muted-foreground">{TEXT.event.page.loading}</p>
    </div>
  </PageContainer>
);

export default EventLoading;
