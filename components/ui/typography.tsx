import React from "react";

interface TypographyH1Props {
  children: React.ReactNode;
}

export const TypographyH1 = ({ children }: TypographyH1Props) => {
  return (
    <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </div>
  );
};

interface TypographyH2Props {
  children: React.ReactNode;
}

export function TypographyH2({ children }: TypographyH2Props) {
  return (
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
