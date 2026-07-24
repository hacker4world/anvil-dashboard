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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  ArrowLeft,
  Bot,
  CheckCircle,
  Clock,
  Cpu,
  FileText,
  Lock,
  Save,
  Terminal,
  Unlock,
  Wand2,
  XCircle,
} from "lucide-react";

// --- Dummy Data ---
const skillInfo = {
  name: "Web Search",
  description:
    "Searches the internet for real-time information, news, and public web pages.",
  prompt:
    "You are a web search assistant. When invoked, take the user's query and format it into a search request. Return the top 5 results with titles, links, and a brief snippet.",
};

const stats = [
  {
    title: "Total Usages",
    value: "1,240",
    icon: Activity,
    color: "text-blue-500",
  },
  { title: "Models Using", value: "3", icon: Cpu, color: "text-purple-500" },
  { title: "Agents Using", value: "4", icon: Bot, color: "text-emerald-500" },
  {
    title: "Success Rate",
    value: "98.5%",
    icon: CheckCircle,
    color: "text-green-500",
  },
];

const modelsList = [
  { id: "1", name: "GPT-4o", invocations: 800, lastUsed: "2 mins ago" },
  {
    id: "2",
    name: "Claude 3.5 Sonnet",
    invocations: 350,
    lastUsed: "1 hour ago",
  },
  { id: "3", name: "Gemini 1.5 Pro", invocations: 90, lastUsed: "5 hours ago" },
];

const agentsList = [
  {
    id: "1",
    name: "Code Reviewer",
    invocations: 500,
    status: "Active",
    lastUsed: "5 mins ago",
  },
  {
    id: "2",
    name: "Bug Triager",
    invocations: 740,
    status: "Active",
    lastUsed: "1 hour ago",
  },
  {
    id: "3",
    name: "Docs Generator",
    invocations: 0,
    status: "Idle",
    lastUsed: "Never",
  },
];

const recentMessages = [
  {
    id: "1",
    caller: "Bug Triager",
    callerType: "Agent",
    query: "Search for recent Node.js memory leak issues in version 20.x",
    status: "Success",
    timestamp: "5 mins ago",
  },
  {
    id: "2",
    caller: "Alice Johnson",
    callerType: "User",
    query: "What is the latest news on the OpenAI DevDay event?",
    status: "Success",
    timestamp: "15 mins ago",
  },
  {
    id: "3",
    caller: "Code Reviewer",
    callerType: "Agent",
    query: "Find documentation for Python's asyncio library version 3.12",
    status: "Success",
    timestamp: "45 mins ago",
  },
  {
    id: "4",
    caller: "Bob Smith",
    callerType: "User",
    query: "Search for the latest stock price of Microsoft (MSFT)",
    status: "Success",
    timestamp: "1 hour ago",
  },
  {
    id: "5",
    caller: "Bug Triager",
    callerType: "Agent",
    query: "Find GitHub issues related to 'React 19 hydration mismatch'",
    status: "Failed",
    timestamp: "3 hours ago",
  },
  {
    id: "6",
    caller: "Docs Generator",
    callerType: "Agent",
    query: "Look up the changelog for Tailwind CSS v4.0",
    status: "Success",
    timestamp: "5 hours ago",
  },
];

// --- Helper Functions ---
const getAgentStatusClasses = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Idle":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    default:
      return "";
  }
};

const getMessageStatusClasses = (status: string) => {
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
export function SkillDetails() {
  const [isEditable, setIsEditable] = useState(false);

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
                {skillInfo.name}
              </h1>
            </div>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              {skillInfo.description}
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

          {/* First Row of Tables: Models & Agents */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  Models Using This Skill
                </CardTitle>
                <CardDescription>
                  Models that have invoked this tool.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead className="text-right">Invocations</TableHead>
                      <TableHead className="text-right">Last Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelsList.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">
                          {model.name}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {model.invocations.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground whitespace-nowrap text-sm">
                          {model.lastUsed}
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
                  <Bot className="h-5 w-5 text-emerald-500" />
                  Agents Using This Skill
                </CardTitle>
                <CardDescription>
                  Agents configured with access to this tool.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invocations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentsList.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">
                          {agent.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getAgentStatusClasses(agent.status)}
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {agent.invocations.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Big Table for Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Messages Using This Skill
              </CardTitle>
              <CardDescription>
                The latest prompts and queries that triggered this skill.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Caller</TableHead>
                    <TableHead>Query / Input Message</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px] text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMessages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{msg.caller}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.callerType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {msg.query}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`gap-1 ${getMessageStatusClasses(msg.status)}`}
                        >
                          {msg.status === "Success" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {msg.status}
                        </Badge>
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
                    Toggle this switch to edit skill details and prompt.
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
              <CardTitle>Skill Configuration</CardTitle>
              <CardDescription>
                Update skill name, description, and execution logic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Skill Name</Label>
                <div className="relative">
                  <Wand2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    defaultValue={skillInfo.name}
                    disabled={!isEditable}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-desc">Description</Label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="edit-desc"
                    defaultValue={skillInfo.description}
                    disabled={!isEditable}
                    className="pl-9 min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-prompt">Skill Prompt</Label>
                <div className="relative">
                  <Terminal className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="edit-prompt"
                    defaultValue={skillInfo.prompt}
                    disabled={!isEditable}
                    className="pl-9 min-h-[200px] resize-none font-mono text-sm"
                  />
                </div>
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
