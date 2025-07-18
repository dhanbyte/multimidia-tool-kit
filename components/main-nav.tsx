// components/main-nav.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  // You can pass additional props if needed
}

export function MainNav({ className, ...props }: MainNavProps) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/" // This will now link to your DashboardPage
        className="text-lg font-bold transition-colors hover:text-primary mr-4"
      >
        MediaTools Pro
      </Link>
      <Link
        href="/" // Link to the dashboard page
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      {/* You can add more direct links here if you want them in the main nav besides the dashboard cards */}
      {/* For example, if you want "Image Compressor" directly in the top nav */}
      {/* <Link
        href="/dashboard/image-compressor"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Image Compressor
      </Link> */}
    </nav>
  );
}

// Optional: If you want a full header with a right-aligned section (e.g., theme toggle, user profile)
export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <MainNav />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* You can put a theme toggle here, or user auth buttons */}
                    {/* <ModeToggle /> */}
                </div>
            </div>
        </header>
    )
    }