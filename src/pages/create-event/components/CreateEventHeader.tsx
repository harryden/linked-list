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
      <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
    </Link>
    <div className="w-px h-5 bg-border-subtle" />
    <span className="text-[13px] font-medium">New event</span>
  </div>
);

export default CreateEventHeader;
