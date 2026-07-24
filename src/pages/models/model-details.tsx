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
  ArrowLeft,
  Bot,
  Box,
  Brackets,
  CheckCircle,
  Cloud,
  Cpu,
  DollarSign,
  Gauge,
  Lock,
  MessageSquare,
  Plus,
  Save,
  Server,
  Trash2,
  Unlock,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";

// --- Dummy Data ---
const modelInfo = {
  name: "GPT-4o",
  pricing: "$5.00 / 1M tokens",
  contextWindow: "128,000 tokens",
  reasoningEfforts: ["low", "medium", "high"], // Added initial efforts
};

const stats = [
  { title: "Total Projects", value: "3", icon: Box, color: "text-blue-500" },
  {
    title: "Total Tokens Used",
    value: "2.4M",
    icon: Cpu,
    color: "text-purple-500",
  },
  { title: "Agents Using", value: "4", icon: Bot, color: "text-emerald-500" },
  {
    title: "Providers Setup",
    value: "2",
    icon: Cloud,
    color: "text-orange-500",
  },
  {
    title: "Avg Response Speed",
    value: "1.2s",
    icon: Gauge,
    color: "text-pink-500",
  },
];

const projectsUsingModel = [
  { id: "1", name: "Anvil Core", messages: 8200, tokens: "1.2M" },
  { id: "2", name: "API Microservices", messages: 1500, tokens: "800K" },
  { id: "3", name: "Mobile App", messages: 300, tokens: "400K" },
];

const agentsUsingModel = [
  { id: "1", name: "Code Reviewer", status: "Active", messages: 1240 },
  { id: "2", name: "Bug Triager", status: "Active", messages: 890 },
  { id: "3", name: "Docs Generator", status: "Idle", messages: 450 },
  { id: "4", name: "Security Scanner", status: "Offline", messages: 120 },
];

const providersForModel = [
  {
    id: "openai",
    name: "OpenAI",
    codeName: "gpt-4o-2024-05-13",
    isEnabled: true,
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    codeName: "gpt-4o-deploy-1",
    isEnabled: true,
  },
  { id: "together", name: "Together AI", codeName: "", isEnabled: false },
];

// NEW: Recent Messages Data
const recentModelMessages = [
  {
    id: "1",
    sender: "Code Reviewer",
    senderType: "Agent",
    message:
      "Analyze this Python function for potential memory leaks and suggest optimizations.",
    timestamp: "2 mins ago",
    tokens: 450,
  },
  {
    id: "2",
    sender: "Alice Johnson",
    senderType: "User",
    message:
      "Summarize the changes made in the latest API authentication pull request.",
    timestamp: "15 mins ago",
    tokens: 210,
  },
  {
    id: "3",
    sender: "Bug Triager",
    senderType: "Agent",
    message: "Categorize the following stack trace into the correct Jira epic.",
    timestamp: "45 mins ago",
    tokens: 890,
  },
  {
    id: "4",
    sender: "Bob Smith",
    senderType: "User",
    message: "Generate unit tests for the database connection utility class.",
    timestamp: "1 hour ago",
    tokens: 320,
  },
  {
    id: "5",
    sender: "Docs Generator",
    senderType: "Agent",
    message: "Read the README.md and generate standard API documentation.",
    timestamp: "3 hours ago",
    tokens: 1240,
  },
];

// NEW: Recent Tool Calls Data
const recentToolCalls = [
  {
    id: "1",
    tool: "File Reader",
    caller: "Docs Generator",
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
    tool: "Code Execution",
    caller: "Bug Triager",
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
  {
    id: "5",
    tool: "Database Access",
    caller: "Security Scanner",
    status: "Failed",
    timestamp: "2 hours ago",
  },
];

// --- Helper Functions ---
const getAgentStatusClasses = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Idle":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "Offline":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    default:
      return "";
  }
};

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
export function ModelDetails() {
  const [isDetailsEditable, setIsDetailsEditable] = useState(false);
  const [isProvidersEditable, setIsProvidersEditable] = useState(false);
  const [providers, setProviders] = useState(providersForModel);
  const [reasoningEfforts, setReasoningEfforts] = useState<string[]>(
    modelInfo.reasoningEfforts,
  );

  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, isEnabled: !p.isEnabled } : p,
      ),
    );
  };

  const handleCodeNameChange = (providerId: string, value: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, codeName: value } : p)),
    );
  };

  // Handlers for dynamic reasoning efforts
  const handleAddEffort = () => {
    setReasoningEfforts([...reasoningEfforts, ""]);
  };

  const handleRemoveEffort = (index: number) => {
    const newEfforts = reasoningEfforts.filter((_, i) => i !== index);
    setReasoningEfforts(newEfforts.length === 0 ? [""] : newEfforts);
  };

  const handleEffortChange = (index: number, value: string) => {
    const newEfforts = [...reasoningEfforts];
    newEfforts[index] = value;
    setReasoningEfforts(newEfforts);
  };

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
                {modelInfo.name}
              </h1>
            </div>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              {modelInfo.contextWindow} • {modelInfo.pricing}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="details">Basic Info</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        {/* TAB 1: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          {/* First Row of Tables: Projects & Agents */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Box className="h-5 w-5 text-blue-500" />
                  Projects Using This Model
                </CardTitle>
                <CardDescription>
                  Projects where this model is actively deployed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Messages</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsUsingModel.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          {project.name}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {project.messages.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {project.tokens}
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
                  Agents Using This Model
                </CardTitle>
                <CardDescription>
                  Autonomous agents configured with this model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Messages</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentsUsingModel.map((agent) => (
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
                          {agent.messages.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Second Row of Tables: Providers (Full Width) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cloud className="h-5 w-5 text-orange-500" />
                Configured Providers
              </CardTitle>
              <CardDescription>
                Providers enabled for this specific model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Model Code Name</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        {provider.name}
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                          {provider.codeName || "Not configured"}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={provider.isEnabled ? "default" : "outline"}
                        >
                          {provider.isEnabled ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Third Row of Tables: Recent Messages & Tool Calls */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Recent Messages Sent
                </CardTitle>
                <CardDescription>
                  Latest prompts processed by this model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead>
                      <TableHead className="max-w-[180px]">Message</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentModelMessages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{msg.sender}</span>
                            <span className="text-xs text-muted-foreground">
                              {msg.senderType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate text-muted-foreground"
                          title={msg.message}
                        >
                          {msg.message}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {msg.tokens}
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  Recent Tool Calls
                </CardTitle>
                <CardDescription>
                  Tool invocations triggered by this model.
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
        </TabsContent>

        {/* TAB 2: BASIC INFO */}
        <TabsContent value="details">
          {/* Modification Toggle Card */}
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${isDetailsEditable ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                >
                  {isDetailsEditable ? (
                    <Unlock className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {isDetailsEditable
                      ? "Modifications Enabled"
                      : "Modifications Locked"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Toggle this switch to edit model specifications.
                  </p>
                </div>
              </div>
              <Switch
                checked={isDetailsEditable}
                onCheckedChange={setIsDetailsEditable}
                aria-label="Toggle modifications"
              />
            </CardContent>
          </Card>

          {/* Details Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Update model name, pricing, context window, and reasoning
                efforts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Model Name</Label>
                <div className="relative">
                  <Cpu className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    defaultValue={modelInfo.name}
                    disabled={!isDetailsEditable}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-pricing">Pricing</Label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="edit-pricing"
                      defaultValue={modelInfo.pricing}
                      disabled={!isDetailsEditable}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-context">Context Window</Label>
                  <div className="relative">
                    <Brackets className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="edit-context"
                      defaultValue={modelInfo.contextWindow}
                      disabled={!isDetailsEditable}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Reasoning Efforts Field */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Reasoning Efforts</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEffort}
                    className="h-7"
                    disabled={!isDetailsEditable}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Effort
                  </Button>
                </div>
                <div className="space-y-3">
                  {reasoningEfforts.map((effort, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={effort}
                        onChange={(e) =>
                          handleEffortChange(index, e.target.value)
                        }
                        placeholder="e.g. low, medium, high, or custom strategy"
                        className="flex-1"
                        disabled={!isDetailsEditable}
                      />
                      {isDetailsEditable && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleRemoveEffort(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Define the reasoning levels or strategies the model can use.
                  You can add multiple efforts.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" disabled={!isDetailsEditable}>
                  Cancel
                </Button>
                <Button disabled={!isDetailsEditable}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PROVIDERS */}
        <TabsContent value="providers">
          {/* Modification Toggle Card */}
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${isProvidersEditable ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                >
                  {isProvidersEditable ? (
                    <Unlock className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {isProvidersEditable
                      ? "Modifications Enabled"
                      : "Modifications Locked"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Toggle this switch to edit provider integrations.
                  </p>
                </div>
              </div>
              <Switch
                checked={isProvidersEditable}
                onCheckedChange={setIsProvidersEditable}
                aria-label="Toggle provider modifications"
              />
            </CardContent>
          </Card>

          {/* Providers Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Integration</CardTitle>
              <CardDescription>
                Enable providers and specify their unique code names for this
                model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`flex flex-col rounded-lg border p-4 transition-colors ${
                      provider.isEnabled
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <Cloud className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <Switch
                        checked={provider.isEnabled}
                        onCheckedChange={() =>
                          handleToggleProvider(provider.id)
                        }
                        disabled={!isProvidersEditable}
                        aria-label={`Toggle ${provider.name}`}
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label
                        htmlFor={`edit-code-${provider.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Model Code Name
                      </Label>
                      <Input
                        id={`edit-code-${provider.id}`}
                        value={provider.codeName}
                        onChange={(e) =>
                          handleCodeNameChange(provider.id, e.target.value)
                        }
                        placeholder="e.g. gpt-4o-2024-05-13"
                        disabled={!isProvidersEditable || !provider.isEnabled}
                        className="font-mono text-xs h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
                <Button variant="outline" disabled={!isProvidersEditable}>
                  Cancel
                </Button>
                <Button disabled={!isProvidersEditable}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Providers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
