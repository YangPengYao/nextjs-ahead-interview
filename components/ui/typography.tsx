import React from "react";
import { cn } from "@/lib/utils";

interface TypographyH1Props extends React.HTMLProps<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const TypographyH1 = ({
  children,
  className,
  ...props
}: TypographyH1Props) => {
  return (
    <div
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface TypographyH2Props extends React.HTMLProps<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function TypographyH2({
  children,
  className,
  ...props
}: TypographyH2Props) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

interface TypographyH3Props extends React.HTMLProps<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function TypographyH3({
  children,
  className,
  ...props
}: TypographyH3Props) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
