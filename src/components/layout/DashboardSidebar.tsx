import {
  Wrench,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Box,
  Package,
  BrainCircuit,
  Sparkle,
  Antenna,
  Radar,
  BrainCog,
  Network,
  ChartArea,
  MessageCircle,
  BrainIcon,
  LucideAntenna,
  Cog,
  CrossIcon,
  CircleAlert,
  Server,
  Cpu,
  Workflow,
  Plug,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.jfif";
import { title } from "process";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    title: "Manage Projects",
    url: "/projects",
    icon: Box,
  },
  { title: "Manage Conversations", url: "/conversations", icon: MessageCircle },
  { title: "Manage Agents", url: "/agents", icon: BrainCircuit },
  {
    title: "Manage models",
    icon: BrainIcon,
    children: [
      {
        title: "Manage Models",
        url: "/models",
        icon: BrainCog,
      },
      {
        title: "Manage Providers",
        url: "/providers",
        icon: Network,
      },
    ],
  },
  {
    title: "Manage Toolkits",
    icon: Cog,
    children: [
      {
        title: "Manage tools",
        url: "/tools",
        icon: Wrench,
      },
      {
        title: "Manage MCP servers",
        url: "/mcp",
        icon: Server,
      },
    ],
  },
  {
    title: "Skills and Workflows",
    icon: Sparkle,
    children: [
      {
        title: "Manage Skills",
        url: "/skills",
        icon: Plug,
      },
      {
        title: "Manage Workflows",
        url: "/workflows",
        icon: Workflow,
      },
    ],
  },
  {
    title: "Anvil Errors",
    url: "/errors",
    icon: CircleAlert,
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (collapsed) {
      setExpandedItem(null);
      return;
    }
    const activeParent = navigationItems.find((item) =>
      item.children?.some((child) => location.pathname === child.url),
    );
    if (activeParent) {
      setExpandedItem(activeParent.title);
    }
  }, [location.pathname, collapsed]);

  const handleToggle = (title: string) => {
    if (collapsed) return;
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    // Added "flex flex-col" here
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Logo - Added flex-shrink-0 to prevent it from shrinking */}
      <div className="flex h-20 flex-shrink-0 items-center justify-between border-b border-sidebar-border px-6">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary overflow-hidden">
              <Package />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Anvil</h1>
              <p className="text-xs text-muted-foreground">
                AI agent dashboard
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary overflow-hidden">
            <img
              src={logo}
              alt="AutoRent Logo"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Navigation - Added flex-1 overflow-y-auto here to make it scrollable */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navigationItems.map((item, index) => {
          const isChildActive = item.children?.some(
            (child) => location.pathname === child.url,
          );
          const isActive = location.pathname === item.url || isChildActive;
          const isExpanded = expandedItem === item.title;

          return (
            <div key={item.title}>
              {item.children ? (
                <button
                  onClick={() => handleToggle(item.title)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-sidebar-foreground border border-transparent",
                    collapsed && "justify-center px-3",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-sidebar-foreground group-hover:text-primary",
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">
                        {item.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                          isExpanded ? "rotate-90" : "rotate-0",
                        )}
                      />
                    </>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.url}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-sidebar-foreground border border-transparent",
                    collapsed && "justify-center px-3",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-sidebar-foreground group-hover:text-primary",
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                  )}
                </NavLink>
              )}

              {item.children && !collapsed && isExpanded && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-4">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.title}
                      to={child.url}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        location.pathname === child.url
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-sidebar-foreground/70 border border-transparent",
                      )}
                    >
                      <child.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{child.title}</span>
                      {location.pathname === child.url && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground shadow-lg transition-colors hover:bg-sidebar-accent hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Footer - Removed absolute positioning, added flex-shrink-0 and mt-auto to stick to bottom safely */}
      {!collapsed && (
        <div className="flex-shrink-0 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <span className="text-sm font-medium text-foreground">AA</span>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-foreground">
                Abdelaziz Arfaoui
              </p>
              <p className="text-xs text-muted-foreground">Developer</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
