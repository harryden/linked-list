import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const DemoNotes = () => (
  <div className="text-center pt-8">
    <Link to="/auth">
      <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium">
        Try LinkBack Now
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Link>
    <p className="text-sm text-muted-foreground mt-4">
      No payments. No friction. Simply login and start scanning.
    </p>
  </div>
);

export default DemoNotes;
