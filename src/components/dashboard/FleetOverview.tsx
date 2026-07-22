import { Car } from "lucide-react";

const vehicles = [
  { name: "Mercedes S-Class", status: "available", image: "🚗" },
  { name: "BMW 7 Series", status: "rented", image: "🚙" },
  { name: "Audi A8", status: "available", image: "🚘" },
  { name: "Porsche Panamera", status: "maintenance", image: "🏎️" },
];

const statusColors = {
  available: "bg-success",
  rented: "bg-primary",
  maintenance: "bg-warning",
};

export function FleetOverview() {
  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fleet Overview</h3>
          <p className="text-sm text-muted-foreground">Vehicle availability status</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">Manage fleet</button>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.name} className="group flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-all hover:border-primary/30 hover:bg-secondary/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
              {vehicle.image}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{vehicle.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full ${statusColors[vehicle.status as keyof typeof statusColors]}`} />
                <span className="text-xs text-muted-foreground capitalize">{vehicle.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">Available: 12</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Rented: 8</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">Maintenance: 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
