import * as React from "react";
import { Info, AlertTriangle, XCircle, LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBannerVariants = cva(
  "flex items-start gap-3 p-4 rounded-lg border",
  {
    variants: {
      variant: {
        informative: "bg-blue-500/10 border-blue-500/30",
        warning: "bg-amber-500/10 border-amber-500/30",
        danger: "bg-destructive/10 border-destructive/30",
      },
    },
    defaultVariants: {
      variant: "informative",
    },
  },
);

const iconContainerVariants = cva(
  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        informative: "bg-blue-500/20",
        warning: "bg-amber-500/20",
        danger: "bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "informative",
    },
  },
);

const iconVariants = cva("h-5 w-5", {
  variants: {
    variant: {
      informative: "text-blue-500",
      warning: "text-amber-500",
      danger: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "informative",
  },
});

const titleVariants = cva("text-sm font-semibold", {
  variants: {
    variant: {
      informative: "text-blue-700",
      warning: "text-amber-700",
      danger: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "informative",
  },
});

const descriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      informative: "text-blue-600/80",
      warning: "text-amber-600/80",
      danger: "text-destructive/80",
    },
  },
  defaultVariants: {
    variant: "informative",
  },
});

const variantIcons = {
  informative: Info,
  warning: AlertTriangle,
  danger: XCircle,
} as const;

export interface StatusBannerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBannerVariants> {
  title: string;
  description: string;
  icon?: LucideIcon;
}

const StatusBanner = React.forwardRef<HTMLDivElement, StatusBannerProps>(
  (
    { className, variant = "informative", title, description, icon, ...props },
    ref,
  ) => {
    const IconComponent = icon || variantIcons[variant || "informative"];

    return (
      <div
        ref={ref}
        className={cn(statusBannerVariants({ variant }), className)}
        {...props}
      >
        <div className={cn(iconContainerVariants({ variant }))}>
          <IconComponent className={cn(iconVariants({ variant }))} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(titleVariants({ variant }))}>{title}</p>
          <p className={cn(descriptionVariants({ variant }))}>{description}</p>
        </div>
      </div>
    );
  },
);

StatusBanner.displayName = "StatusBanner";

export { StatusBanner, statusBannerVariants };
