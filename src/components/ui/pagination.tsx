import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { createContext, useContext } from "react";

const PaginationContext = createContext<PaginationProps>({
  currentPage: 1,
  lastPage: 1,
});

export type PaginationProps = React.ComponentProps<"nav"> & {
  currentPage?: number;
  lastPage?: number;
};

const Pagination = ({ className, currentPage, lastPage, ...props }: PaginationProps) => {
  return (
    <PaginationContext.Provider value={{ currentPage, lastPage }}>
      <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      />
    </PaginationContext.Provider>
  );
};
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1 ", className)}
      {...props}
    />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  ),
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
      isActive ? "text-black" : "cursor-pointer"
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { currentPage } = useContext(PaginationContext);
  const isDisabled = currentPage === undefined || currentPage <= 1;
  return (
    <PaginationLink
      aria-label="Go to previous page"
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      size="default"
      className={cn(
        "gap-1 pl-2.5 cursor-pointer",
        className,
        isDisabled ? ["pointer-events-none opacity-50"] : [],
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { currentPage, lastPage } = useContext(PaginationContext);
  const isDisabled = currentPage === undefined || currentPage >= (lastPage || 0);
  return (
    <PaginationLink
      aria-label="Go to next page"
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      size="default"
      className={cn(
        "gap-1 pr-2.5",
        className,
        isDisabled ? ["pointer-events-none opacity-50"] : [],
      )}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { currentPage } = useContext(PaginationContext);
  const isDisabled = currentPage === undefined || currentPage <= 1;
  return (
    <PaginationLink
      aria-label="Go to first page"
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      size="default"
      className={cn(
        "gap-1 px-2.5",
        className,
        isDisabled ? ["pointer-events-none opacity-50"] : [],
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <ChevronLeft className="h-4 w-4 -ml-3" />
    </PaginationLink>
  );
};
PaginationFirst.displayName = "PaginationFirst";

const PaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { currentPage, lastPage } = useContext(PaginationContext);
  const isDisabled = currentPage === undefined || currentPage >= (lastPage || 0);
  return (
    <PaginationLink
      aria-label="Go to last page"
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      size="default"
      className={cn(
        "gap-1 px-2.5",
        className,
        isDisabled ? ["pointer-events-none opacity-50"] : [],
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <ChevronRight className="h-4 w-4 -ml-3" />
    </PaginationLink>
  );
};
PaginationLast.displayName = "PaginationLast";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
};