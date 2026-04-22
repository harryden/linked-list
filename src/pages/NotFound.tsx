import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { TEXT } from "@/constants/text";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`,
      { category: "UI" },
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[320px] text-center">
        <div className="flex justify-center mb-8">
          <LogoMark size={32} />
        </div>

        <div className="text-[11px] font-mono text-text-secondary tracking-[1px] uppercase">
          {TEXT.notFound.title} — PAGE NOT FOUND
        </div>

        <h1 className="text-[32px] font-semibold tracking-[-0.8px] mt-3 leading-tight">
          Lost in the grid.
        </h1>

        <p className="text-[14px] text-text-secondary leading-relaxed mt-4 mb-8">
          {TEXT.notFound.subtitle}. The page you're looking for doesn't exist or
          has been moved.
        </p>

        <Button asChild variant="primary" size="lg" className="w-full gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {TEXT.notFound.link}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
