import { DashboardLayout } from "@/components/layout/DashboardLayout";

export function ProjectList() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all projects associated with Anvil
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
