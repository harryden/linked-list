import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { TEXT } from "@/constants/text";
import linkbackLogo from "@/assets/linkback-logo.png";

interface DashboardHeaderProps {
  name?: string | null;
  headline?: string | null;
  avatarUrl?: string | null;
  onSignOut: () => void;
  greeting?: string;
}

const DashboardHeader = ({
  name,
  headline,
  avatarUrl,
  onSignOut,
  greeting,
}: DashboardHeaderProps) => {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const welcomeMessage = greeting
    ? greeting
    : name
      ? `${TEXT.dashboard.header.welcomePrefix} ${name}!`
      : TEXT.dashboard.header.welcomePrefix;

  return (
    <>
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={linkbackLogo} alt="LinkBack" className="h-20 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <p className="font-medium">{name}</p>
                {headline && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {headline}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{welcomeMessage}</h1>
          <p className="text-muted-foreground">
            {TEXT.dashboard.header.tagline}
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
