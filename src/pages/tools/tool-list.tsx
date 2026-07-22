import { DashboardLayout } from "@/components/layout/DashboardLayout";

export function ToolList() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Tools
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage the tools Anvil can use to operate
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
