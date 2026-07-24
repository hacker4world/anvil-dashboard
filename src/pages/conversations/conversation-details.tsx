import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Cpu,
  MessageCircle,
  MessagesSquare,
  Trash2,
  User,
  Wrench,
  XCircle,
} from "lucide-react";

// --- Dummy Data ---
const conversationInfo = {
  title: "Database connection pool optimization",
  createdAt: "2 days ago",
};

const stats = [
  {
    title: "Total Messages",
    value: "24",
    icon: MessageCircle,
    color: "text-blue-500",
  },
  { title: "Models Used", value: "2", icon: Cpu, color: "text-purple-500" },
  {
    title: "Total Tool Calls",
    value: "5",
    icon: Wrench,
    color: "text-orange-500",
  },
  {
    title: "Failed Tool Calls",
    value: "1",
    icon: XCircle,
    color: "text-red-500",
  },
];

const modelsUsed = [
  { id: "1", name: "GPT-4o", messages: 18, tokens: "2.4K" },
  { id: "2", name: "Claude 3.5 Sonnet", messages: 6, tokens: "1.1K" },
];

const recentToolCalls = [
  {
    id: "1",
    tool: "Code Execution",
    caller: "Bug Triager",
    status: "Success",
    timestamp: "10 mins ago",
  },
  {
    id: "2",
    tool: "Database Access",
    caller: "Bug Triager",
    status: "Failed",
    timestamp: "15 mins ago",
  },
  {
    id: "3",
    tool: "Web Search",
    caller: "Bug Triager",
    status: "Success",
    timestamp: "25 mins ago",
  },
  {
    id: "4",
    tool: "File Reader",
    caller: "Bug Triager",
    status: "Success",
    timestamp: "1 hour ago",
  },
];

const allMessages = [
  {
    id: "1",
    sender: "Alice Johnson",
    senderType: "User",
    message:
      "Can you help me optimize the database connection pool? We are seeing timeouts under heavy load.",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "Bug Triager",
    senderType: "Agent",
    message:
      "I can help with that. Let me first check the current database configuration and recent error logs.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    sender: "Bug Triager",
    senderType: "Agent (Tool Call)",
    message:
      "Executing SQL query to check active connections and pool limits...",
    timestamp: "10:01 AM",
  },
  {
    id: "4",
    sender: "Bug Triager",
    senderType: "Agent",
    message:
      "It looks like the max_connections is set to 100, but your application is trying to open 250 concurrent connections. Let me search for best practices on connection pooling.",
    timestamp: "10:03 AM",
  },
  {
    id: "5",
    sender: "Alice Johnson",
    senderType: "User",
    message: "Ah, I see. What library should we use for pooling in Node.js?",
    timestamp: "10:05 AM",
  },
  {
    id: "6",
    sender: "Bug Triager",
    senderType: "Agent",
    message:
      "I recommend using `pg-pool` for PostgreSQL in Node.js. I can generate a configuration file for you if you'd like.",
    timestamp: "10:06 AM",
  },
  {
    id: "7",
    sender: "Alice Johnson",
    senderType: "User",
    message:
      "Yes, please generate a standard config file with optimized defaults.",
    timestamp: "10:07 AM",
  },
  {
    id: "8",
    sender: "Bug Triager",
    senderType: "Agent",
    message:
      "Here is a standard `pg-pool` configuration. I've set the max connections to 20, which should safely handle your load without overwhelming the database.",
    timestamp: "10:08 AM",
  },
];

// --- Helper Functions ---
const getToolCallStatusClasses = (status: string) => {
  switch (status) {
    case "Success":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Failed":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "";
  }
};

// --- Main Component ---
export function ConversationDetails() {
  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {conversationInfo.title}
              </h1>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Started {conversationInfo.createdAt}
            </p>
          </div>
        </div>

        {/* Delete Action */}
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Conversation
        </Button>
      </div>

      {/* Analytics Content */}
      <div className="space-y-6">
        {/* Top Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* First Row of Tables: Models & Tool Calls */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5 text-purple-500" />
                Models Used
              </CardTitle>
              <CardDescription>
                LLMs utilized during this conversation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead className="text-right">Messages</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelsUsed.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">
                        {model.name}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {model.messages}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {model.tokens}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5 text-orange-500" />
                Recent Tool Calls
              </CardTitle>
              <CardDescription>
                Tools invoked by agents in this chat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentToolCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">{call.tool}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {call.caller}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`gap-1 ${getToolCallStatusClasses(call.status)}`}
                        >
                          {call.status === "Success" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground whitespace-nowrap text-sm">
                        {call.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Table: All Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessagesSquare className="h-5 w-5 text-blue-500" />
              Conversation Transcript
            </CardTitle>
            <CardDescription>
              The complete history of this conversation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Sender</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[100px] text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${msg.senderType.includes("User") ? "bg-blue-500/10" : "bg-emerald-500/10"}`}
                        >
                          {msg.senderType.includes("User") ? (
                            <User className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Bot className="h-4 w-4 text-emerald-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.senderType}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {msg.message}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground whitespace-nowrap text-sm">
                      {msg.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
