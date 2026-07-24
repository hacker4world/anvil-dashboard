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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Save, Terminal, Wand2 } from "lucide-react";

export function CreateSkill() {
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [skillPrompt, setSkillPrompt] = useState("");

  const handleCreateSkill = () => {
    // Does nothing for now, just logging the state
    console.log("Creating Skill:", {
      name: skillName,
      description,
      prompt: skillPrompt,
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
                Create New Skill
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Define a new tool or capability for your agents to use.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Configuration</CardTitle>
          <CardDescription>
            Enter the details for the new skill. The prompt defines how the
            agent should use it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skill Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <div className="relative">
              <Wand2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="skill-name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Web Search"
                className="pl-9"
              />
            </div>
          </div>

          {/* Description Field - Fixed Icon Alignment */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Searches the internet for real-time information."
                className="pl-9 min-h-[100px] resize-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              A brief summary of what the skill does. This helps the agent
              decide when to use it.
            </p>
          </div>

          {/* Skill Prompt Area */}
          <div className="grid gap-2">
            <Label htmlFor="skill-prompt">Skill Prompt</Label>
            <div className="relative">
              <Terminal className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="skill-prompt"
                value={skillPrompt}
                onChange={(e) => setSkillPrompt(e.target.value)}
                placeholder="You are a web search assistant. When invoked, take the user's query and format it into a search request..."
                className="pl-9 min-h-[240px] resize-none font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Define the execution logic and instructions for this skill.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleCreateSkill}>
            <Save className="mr-2 h-4 w-4" />
            Create Skill
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
