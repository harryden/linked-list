import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CreateEventHeaderProps {
  backPath: string;
  backText?: string;
}

const CreateEventHeader = ({ backPath }: CreateEventHeaderProps) => (
  <div className="bg-bg-base border-b border-border-subtle px-8 py-3 flex items-center gap-4">
    <Link to={backPath}>
      <Button variant="ghost" size="sm" className="gap-1.5">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back
      </Button>
    </Link>
    <div className="w-px h-5 bg-border-subtle" />
    <span className="text-[13px] font-medium">New event</span>
    <div className="flex-1" />
    <Button variant="ghost" size="sm">
      Save draft
    </Button>
  </div>
);

export default CreateEventHeader;
