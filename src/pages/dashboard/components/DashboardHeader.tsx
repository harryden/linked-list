import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { TEXT } from "@/constants/text";
import Heading from "@/components/ui/heading";

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
          <Link to="/">
            <span className="font-display font-black text-xl tracking-tight">
              LinkBack
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar src={avatarUrl} name={name} className="h-10 w-10" />
              <div className="text-right hidden sm:block">
                <p className="font-medium">{name}</p>
                {headline && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {headline}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onSignOut}
              aria-label={TEXT.common.buttons.signOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Heading level={1} className="mb-2 leading-tight">
            {welcomeMessage}
          </Heading>
          <p className="text-muted-foreground text-lg">
            {TEXT.dashboard.header.tagline}
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
