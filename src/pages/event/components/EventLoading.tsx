import { TEXT } from "@/constants/text";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const EventLoading = () => (
  <LoadingScreen
    title={TEXT.event.page.loadingTitle}
    message={TEXT.event.page.loadingMessage}
  />
);

export default EventLoading;
