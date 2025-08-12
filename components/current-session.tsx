import { Session } from "next-auth";

export default function CurrentSession({
  session,
}: {
  session: Session | null;
}) {
  return (
    <div className="border-border flex flex-col gap-2 rounded-md border p-4 text-center">
      <div className="text-secondary-foreground">Current Session:</div>
      <div className="text-secondary-foreground font-mono text-xs">
        {JSON.stringify(session)}
      </div>
    </div>
  );
}
