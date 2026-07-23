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
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Brackets,
  Cloud,
  Cpu,
  DollarSign,
  Save,
  Server,
  Zap,
} from "lucide-react";

// Dummy data for available providers
const initialProviders = [
  {
    id: "openai",
    name: "OpenAI",
    icon: Cloud,
    isSelected: false,
    codeName: "",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: Zap,
    isSelected: false,
    codeName: "",
  },
  {
    id: "google",
    name: "Google Vertex AI",
    icon: Server,
    isSelected: false,
    codeName: "",
  },
  { id: "groq", name: "Groq", icon: Zap, isSelected: false, codeName: "" },
  {
    id: "together",
    name: "Together AI",
    icon: Cloud,
    isSelected: false,
    codeName: "",
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    icon: Server,
    isSelected: false,
    codeName: "",
  },
];

export function CreateModel() {
  const [modelName, setModelName] = useState("");
  const [pricing, setPricing] = useState("");
  const [contextWindow, setContextWindow] = useState("");

  const [providers, setProviders] = useState(initialProviders);

  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, isSelected: !p.isSelected } : p,
      ),
    );
  };

  const handleCodeNameChange = (providerId: string, value: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, codeName: value } : p)),
    );
  };

  const handleCreateModel = () => {
    // Does nothing for now, just logging the state
    const selectedProviders = providers.filter((p) => p.isSelected);
    console.log("Creating Model:", {
      name: modelName,
      pricing,
      contextWindow,
      providers: selectedProviders,
    });
  };

  const selectedProvidersCount = providers.filter((p) => p.isSelected).length;

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
                Create New Model
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Define model specifications and configure providers.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
          <TabsTrigger value="providers">2. Providers</TabsTrigger>
        </TabsList>

        {/* TAB 1: BASIC INFO */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Set the identity and specifications of your model.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="model-name">Model Name</Label>
                <div className="relative">
                  <Cpu className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="model-name"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. GPT-4o"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Pricing Field */}
                <div className="grid gap-2">
                  <Label htmlFor="pricing">Pricing</Label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pricing"
                      value={pricing}
                      onChange={(e) => setPricing(e.target.value)}
                      placeholder="$5.00 / 1M tokens"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Context Window Field */}
                <div className="grid gap-2">
                  <Label htmlFor="context">Context Window</Label>
                  <div className="relative">
                    <Brackets className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="context"
                      value={contextWindow}
                      onChange={(e) => setContextWindow(e.target.value)}
                      placeholder="128,000 tokens"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PROVIDERS */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Provider Integration</CardTitle>
              <CardDescription>
                Enable the providers that support this model and specify their
                unique code names.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map((provider) => {
                  const Icon = provider.icon;
                  return (
                    <div
                      key={provider.id}
                      className={`flex flex-col rounded-lg border p-4 transition-colors ${
                        provider.isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Icon className="h-4 w-4 text-foreground" />
                          </div>
                          <span className="font-medium">{provider.name}</span>
                        </div>
                        <Switch
                          checked={provider.isSelected}
                          onCheckedChange={() =>
                            handleToggleProvider(provider.id)
                          }
                          aria-label={`Toggle ${provider.name}`}
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <Label
                          htmlFor={`code-${provider.id}`}
                          className="text-xs text-muted-foreground"
                        >
                          Model Code Name
                        </Label>
                        <Input
                          id={`code-${provider.id}`}
                          value={provider.codeName}
                          onChange={(e) =>
                            handleCodeNameChange(provider.id, e.target.value)
                          }
                          placeholder="e.g. gpt-4o-2024-05-13"
                          disabled={!provider.isSelected}
                          className="font-mono text-xs h-8"
                        />
                      </div>
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
            {selectedProvidersCount} provider
            {selectedProvidersCount === 1 ? "" : "s"} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button onClick={handleCreateModel}>
              <Save className="mr-2 h-4 w-4" />
              Create Model
            </Button>
          </div>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
