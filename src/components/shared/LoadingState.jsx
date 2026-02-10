import { Loader2 } from "lucide-react";

export const LoadingState = ({ name }) => {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Top Section */}
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading {name}…</p>
      </div>

      {/* Skeleton Table */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-full bg-muted rounded-md animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};
