import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-6 text-center p-8">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">404</h1>
          <p className="text-xl text-muted-foreground">Scene not found</p>
        </div>

        <p className="text-muted-foreground max-w-sm">
          The page you're looking for seems to have been cut from the final edit.
        </p>

        <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          Return to Set
        </Link>
      </div>
    </div>
  );
}
