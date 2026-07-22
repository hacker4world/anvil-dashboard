import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const reservations = [
  { id: "RES-001", client: "Emma Thompson", vehicle: "Mercedes S-Class", date: "Jan 26, 2026", status: "active" },
  { id: "RES-002", client: "Michael Chen", vehicle: "BMW 7 Series", date: "Jan 25, 2026", status: "pending" },
  { id: "RES-003", client: "Sarah Johnson", vehicle: "Audi A8", date: "Jan 24, 2026", status: "completed" },
  { id: "RES-004", client: "David Williams", vehicle: "Porsche Panamera", date: "Jan 23, 2026", status: "active" },
  { id: "RES-005", client: "Lisa Anderson", vehicle: "Tesla Model S", date: "Jan 22, 2026", status: "cancelled" },
];

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentReservations() {
  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Reservations</h3>
          <p className="text-sm text-muted-foreground">Latest booking activities</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">View all</button>
      </div>
      <div className="divide-y divide-border">
        {reservations.map((reservation, index) => (
          <div 
            key={reservation.id} 
            className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/30"
            style={{ animationDelay: `${500 + index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-muted-foreground">
                {reservation.client.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-foreground">{reservation.client}</p>
                <p className="text-sm text-muted-foreground">{reservation.vehicle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{reservation.date}</span>
              <Badge 
                variant="outline" 
                className={cn("capitalize", statusStyles[reservation.status as keyof typeof statusStyles])}
              >
                {reservation.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
