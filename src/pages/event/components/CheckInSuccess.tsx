import { CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TEXT } from "@/constants/text";

interface CheckInSuccessProps {
  onDismiss: () => void;
}

const CheckInSuccess = ({ onDismiss }: CheckInSuccessProps) => (
  <Alert className="mb-4">
    <CheckCircle className="h-4 w-4" aria-hidden="true" />
    <AlertDescription className="flex items-center justify-between">
      <span>{TEXT.event.page.checkInSuccessBanner}</span>
      <button
        onClick={onDismiss}
        className="ml-4 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </AlertDescription>
  </Alert>
);

export default CheckInSuccess;
