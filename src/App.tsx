import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Index } from "./pages/Index";
import { ProjectList } from "./pages/projects/project-list";
import { ConversationList } from "./pages/conversations/conversation-list";
import { AgentList } from "./pages/agents/agent-list";
import { ModelList } from "./pages/models/model-list";
import { ProviderList } from "./pages/providers/provider-list";
import { ToolList } from "./pages/tools/tool-list";
import { SkillList } from "./pages/skills/skill-list";
import { McpServerList } from "./pages/mcp-servers/mcp-list";
import { ErrorList } from "./errors/error-list";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/conversations" element={<ConversationList />} />
            <Route path="/agents" element={<AgentList />} />
            <Route path="/models" element={<ModelList />} />
            <Route path="/providers" element={<ProviderList />} />
            <Route path="/tools" element={<ToolList />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/mcp" element={<McpServerList />} />
            <Route path="/errors" element={<ErrorList />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
