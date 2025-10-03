import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const DemoHeader = () => (
  <>
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <QrCode className="h-8 w-8 text-primary" />
          <span className="text-2xl font-semibold">LinkBack</span>
        </Link>
        <Link to="/auth">
          <Button variant="outline" className="rounded-full">
            Get Started
          </Button>
        </Link>
      </div>
    </header>

    <div className="container mx-auto px-4 pt-12">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">See LinkBack in Action</h1>
        <p className="text-xl text-muted-foreground">
          Experience how easy event check-ins can be
        </p>
      </div>
    </div>
  </>
);

export default DemoHeader;
