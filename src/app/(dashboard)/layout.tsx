import { MainNav } from "@/components/layout/MainNav";
import { SubNav } from "@/components/layout/SubNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <MainNav />
      <SubNav />
      <main className="p-4xl">{children}</main>
    </div>
  );
}
