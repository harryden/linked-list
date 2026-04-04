import { TEXT } from "@/constants/text";
import PageContainer from "@/components/layout/PageContainer";

const EventLoading = () => (
  <PageContainer className="items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">{TEXT.event.page.loading}</p>
    </div>
  </PageContainer>
);

export default EventLoading;
