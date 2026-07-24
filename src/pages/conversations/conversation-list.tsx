import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutGrid,
  List,
  MessageCircle,
  MessagesSquare,
  Plus,
} from "lucide-react";

// Dummy data for demonstration
const conversations = [
  {
    id: "1",
    title: "Database connection pool optimization",
    totalMessages: 24,
  },
  {
    id: "2",
    title: "Authentication module PR review",
    totalMessages: 15,
  },
  {
    id: "3",
    title: "Staging deployment failure troubleshooting",
    totalMessages: 42,
  },
  {
    id: "4",
    title: "API /users endpoint 500 error",
    totalMessages: 8,
  },
  {
    id: "5",
    title: "CI/CD pipeline test stage fix",
    totalMessages: 31,
  },
];

export function ConversationList() {
  const [view, setView] = useState<"table" | "card">("table");

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Conversations
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all user and agent conversations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-md border p-1">
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setView("table")}
            >
              <List className="mr-2 h-4 w-4" />
              Table
            </Button>
            <Button
              variant={view === "card" ? "secondary" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setView("card")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Cards
            </Button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conversation Title</TableHead>
                <TableHead className="text-right">Total Messages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.map((convo) => (
                <TableRow key={convo.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MessagesSquare className="h-4 w-4 text-blue-500" />
                      {convo.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-2 text-muted-foreground">
                      {convo.totalMessages.toLocaleString()}
                      <MessageCircle className="h-4 w-4 text-emerald-500" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {conversations.map((convo) => (
            <Card
              key={convo.id}
              className="flex flex-col cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <MessagesSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg line-clamp-2 leading-tight">
                    {convo.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <MessageCircle className="mr-2 h-4 w-4 text-emerald-500" />
                    Total Messages
                  </span>
                  <span className="font-medium tabular-nums">
                    {convo.totalMessages.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
