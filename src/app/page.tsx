import AuthGuard from "@/components/auth/AuthGuard";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Page() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
