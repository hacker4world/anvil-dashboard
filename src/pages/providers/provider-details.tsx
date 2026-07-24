import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Cloud,
  Cpu,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Lock,
  MessageSquare,
  Save,
  Unlock,
  Wrench,
  XCircle,
} from "lucide-react";

// --- Dummy Data ---
const providerInfo = {
  name: "OpenAI",
  baseUrl: "https://api.openai.com/v1",
  apiKey: "sk-proj-1234567890abcdef",
};

const stats = [
  {
    title: "Total Messages",
    value: "42,150",
    icon: MessageSquare,
    color: "text-blue-500",
  },
  { title: "Models Using", value: "4", icon: Cpu, color: "text-purple-500" },
  {
    title: "Total Tool Calls",
    value: "2,340",
    icon: Wrench,
    color: "text-orange-500",
  },
  {
    title: "Provider Errors",
    value: "12",
    icon: AlertTriangle,
    color: "text-red-500",
  },
];

const modelsUsingProvider = [
  {
    id: "1",
    name: "GPT-4o",
    codeName: "gpt-4o-2024-05-13",
    messages: 8200,
    status: "Active",
  },
  {
    id: "2",
    name: "GPT-4 Turbo",
    codeName: "gpt-4-turbo",
    messages: 4100,
    status: "Active",
  },
  {
    id: "3",
    name: "GPT-3.5 Turbo",
    codeName: "gpt-3.5-turbo",
    messages: 12000,
    status: "Active",
  },
  {
    id: "4",
    name: "Text Embedding 3",
    codeName: "text-embedding-3-small",
    messages: 17850,
    status: "Active",
  },
];

const recentToolCalls = [
  {
    id: "1",
    tool: "Code Execution",
    caller: "Bug Triager",
    status: "Success",
    timestamp: "5 mins ago",
  },
  {
    id: "2",
    tool: "Web Search",
    caller: "Code Reviewer",
    status: "Success",
    timestamp: "12 mins ago",
  },
  {
    id: "3",
    tool: "File Reader",
    caller: "Docs Generator",
    status: "Failed",
    timestamp: "45 mins ago",
  },
  {
    id: "4",
    tool: "GitHub API",
    caller: "Code Reviewer",
    status: "Success",
    timestamp: "1 hour ago",
  },
];

const recentErrors = [
  {
    id: "1",
    model: "GPT-4o",
    errorCode: "429 Too Many Requests",
    message: "Rate limit exceeded for requests.",
    timestamp: "10 mins ago",
  },
  {
    id: "2",
    model: "GPT-4 Turbo",
    errorCode: "500 Internal Server Error",
    message: "The server had an error processing your request.",
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    model: "GPT-4o",
    errorCode: "401 Unauthorized",
    message: "Incorrect API key provided.",
    timestamp: "1 day ago",
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

const getErrorBadgeClasses = (code: string) => {
  if (code.startsWith("4"))
    return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  if (code.startsWith("5"))
    return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-gray-500/10 text-gray-600 border-gray-500/20";
};

// --- Main Component ---
export function ProviderDetails() {
  const [isEditable, setIsEditable] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

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
                {providerInfo.name}
              </h1>
            </div>
            <p className="text-muted-foreground mt-1 font-mono text-xs flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {providerInfo.baseUrl}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* TAB 1: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
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
                  Models Using This Provider
                </CardTitle>
                <CardDescription>
                  Models configured to route through this provider.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Code Name</TableHead>
                      <TableHead className="text-right">Messages</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelsUsingProvider.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">
                          {model.name}
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                            {model.codeName}
                          </code>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {model.messages.toLocaleString()}
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
                  Latest tool executions processed by this provider.
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
                        <TableCell className="font-medium">
                          {call.tool}
                        </TableCell>
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

          {/* Second Row of Tables: Recent Errors (Full Width) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Recent Provider Errors
              </CardTitle>
              <CardDescription>
                API errors and exceptions logged for this provider.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Error Code</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentErrors.map((err) => (
                    <TableRow key={err.id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getErrorBadgeClasses(err.errorCode)}
                        >
                          {err.errorCode.split(" ")[0]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{err.model}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {err.message}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground whitespace-nowrap text-sm">
                        {err.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SETTINGS */}
        <TabsContent value="settings">
          {/* Modification Toggle Card */}
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${isEditable ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                >
                  {isEditable ? (
                    <Unlock className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {isEditable
                      ? "Modifications Enabled"
                      : "Modifications Locked"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Toggle this switch to edit provider credentials.
                  </p>
                </div>
              </div>
              <Switch
                checked={isEditable}
                onCheckedChange={setIsEditable}
                aria-label="Toggle modifications"
              />
            </CardContent>
          </Card>

          {/* Settings Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Configuration</CardTitle>
              <CardDescription>
                Update provider name, base URL, and API key.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Provider Name</Label>
                  <div className="relative">
                    <Cloud className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="edit-name"
                      defaultValue={providerInfo.name}
                      disabled={!isEditable}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-url">Base URL</Label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="edit-url"
                      defaultValue={providerInfo.baseUrl}
                      disabled={!isEditable}
                      className="pl-9 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-api-key">API Key</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-api-key"
                    type={showApiKey ? "text" : "password"}
                    defaultValue={providerInfo.apiKey}
                    disabled={!isEditable}
                    className="pl-9 pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowApiKey(!showApiKey)}
                    disabled={!isEditable}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ensure you keep your API key secure. It is masked for security
                  reasons.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="outline" disabled={!isEditable}>
                  Cancel
                </Button>
                <Button disabled={!isEditable}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
