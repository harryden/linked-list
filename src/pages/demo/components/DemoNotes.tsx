import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TEXT } from "@/constants/text";

const DemoNotes = () => (
  <div className="text-center pt-8">
    <Link to="/auth">
      <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium">
        {TEXT.common.buttons.tryLinkBackNow}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Link>
    <p className="text-sm text-muted-foreground mt-4">
      {TEXT.demo.notes.helper}
    </p>
  </div>
);

export default DemoNotes;
