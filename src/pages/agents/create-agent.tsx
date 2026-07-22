import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Database,
  FileText,
  Image,
  Save,
  Search,
  Terminal,
  Wrench,
} from "lucide-react";

// Dummy data for available tools
const availableTools = [
  {
    id: "web_search",
    name: "Web Search",
    description: "Search the internet for real-time information.",
    icon: Search,
  },
  {
    id: "code_exec",
    name: "Code Execution",
    description: "Run Python or Node.js code in a secure sandbox.",
    icon: Terminal,
  },
  {
    id: "file_reader",
    name: "File Reader",
    description: "Read and parse files from the project directory.",
    icon: FileText,
  },
  {
    id: "db_access",
    name: "Database Access",
    description: "Query the connected PostgreSQL database.",
    icon: Database,
  },
  {
    id: "image_gen",
    name: "Image Generation",
    description: "Generate images using DALL-E or Stable Diffusion.",
    icon: Image,
  },
  {
    id: "api_caller",
    name: "API Caller",
    description: "Make authenticated HTTP requests to external APIs.",
    icon: Wrench,
  },
];

export function CreateAgent() {
  const [agentName, setAgentName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>(["web_search"]);

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const handleCreateAgent = () => {
    // Does nothing for now, just logging the state
    console.log("Creating Agent:", {
      name: agentName,
      prompt: systemPrompt,
      tools: selectedTools,
    });
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
                Create New Agent
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Configure a new autonomous agent and assign its tools.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
          <TabsTrigger value="tools">2. Tools Selection</TabsTrigger>
        </TabsList>

        {/* TAB 1: BASIC INFO */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>
                Set the identity and behavior of your agent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <div className="relative">
                  <Bot className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="agent-name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Code Reviewer"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* System Prompt Field */}
              <div className="grid gap-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful assistant specialized in..."
                  rows={8}
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define the agent's persona, goals, and constraints. This
                  message is sent at the beginning of every conversation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: TOOLS SELECTION */}
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
              <CardDescription>
                Select the tools this agent can use. The agent will only be able
                to access tools you enable here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableTools.map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  const Icon = tool.icon;

                  return (
                    <div
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`relative flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:bg-muted/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border"
                      }`}
                    >
                      {/* Selection Checkmark */}
                      {isSelected && (
                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}

                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>

                      <h3 className="mb-1 font-semibold">{tool.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sticky Footer Actions */}
        <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            {selectedTools.length} tool{selectedTools.length === 1 ? "" : "s"}{" "}
            selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>
              <Save className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </div>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
