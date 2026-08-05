import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <Dashboard
      onOpenTutor={() => {
        console.log("AI Tutor Clicked");
      }}
    />
  );
}