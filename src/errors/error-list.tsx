import { DashboardLayout } from "@/components/layout/DashboardLayout";

export function ErrorList() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Errors
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage the critical errors Anvil has encountered for debugging purposes
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
