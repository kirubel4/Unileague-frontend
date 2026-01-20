import { TopBar } from "./ui/TopBar";
import { Sidebar } from "./ui/Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  role?: "super_admin" | "manager" | "coach";
  userName?: string;
}

export function Layout({ children, role, userName }: LayoutProps) {
  const userRoleDisplay = role === "super_admin" ? "Super Admin" : "Manager";

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* TopBar */}
      <div className="sticky top-0 z-50">
        <TopBar userRole={userRoleDisplay} userName={userName} />
      </div>

      <div className="flex pt-16 flex-1">
        <Sidebar role={role} />
        <main className={cn("flex-1 transition-all duration-300", "lg:ml-64")}>
          <div className="p-6 md:p-8">{children}</div>{" "}
        </main>
      </div>
    </div>
  );
}
