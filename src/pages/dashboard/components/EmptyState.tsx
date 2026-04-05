import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
}

const EmptyState = ({ icon, title, description, actions }: EmptyStateProps) => (
  <div className="py-12 text-center space-y-4 border-y border-border">
    <div className="flex justify-center">{icon}</div>
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    {actions && <div className="flex gap-3 justify-center">{actions}</div>}
  </div>
);

export default EmptyState;
