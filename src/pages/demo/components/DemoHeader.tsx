import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TEXT } from "@/constants/text";
import linkbackLogo from "@/assets/linkback-logo.png";

const DemoHeader = () => (
  <>
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={linkbackLogo} alt="LinkBack" className="h-20 w-auto" />
        </Link>
        <Link to="/auth">
          <Button variant="outline" className="rounded-full">
            {TEXT.common.buttons.getStarted}
          </Button>
        </Link>
      </div>
    </header>

    <div className="container mx-auto px-4 pt-12">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">{TEXT.demo.header.title}</h1>
        <p className="text-xl text-muted-foreground">
          {TEXT.demo.header.subtitle}
        </p>
      </div>
    </div>
  </>
);

export default DemoHeader;
