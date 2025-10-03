import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowLeft } from "lucide-react";
import { TEXT } from "@/constants/text";

interface CreateEventHeaderProps {
  backPath: string;
  backText: string;
}

const CreateEventHeader = ({ backPath, backText }: CreateEventHeaderProps) => (
  <>
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">{TEXT.common.brand}</span>
          </Link>
        </div>
      </header>

    <div className="container mx-auto px-4 pt-8">
      <div className="max-w-2xl mx-auto">
        <Link to={backPath}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backText}
          </Button>
        </Link>
      </div>
    </div>
  </>
);

export default CreateEventHeader;
