import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Cloud,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Save,
} from "lucide-react";

export function CreateProvider() {
  const [providerName, setProviderName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleCreateProvider = () => {
    // Does nothing for now, just logging the state
    console.log("Creating Provider:", {
      name: providerName,
      baseUrl,
      apiKey: apiKey ? "******" : "empty", // Don't log real keys in production
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
                Create New Provider
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Configure a new LLM provider and its API credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card - Now takes full width */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Configuration</CardTitle>
          <CardDescription>
            Enter the details for the new provider. API keys are encrypted at
            rest.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Responsive 2-column grid for Name and URL */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Provider Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="provider-name">Provider Name</Label>
              <div className="relative">
                <Cloud className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="provider-name"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. OpenAI"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Base URL Field */}
            <div className="grid gap-2">
              <Label htmlFor="base-url">Base URL</Label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="base-url"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* API Key Field (Full Width) */}
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your secret API key"
                className="pl-9 pr-10 font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Never share your API key. It will be stored securely.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleCreateProvider}>
            <Save className="mr-2 h-4 w-4" />
            Create Provider
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
