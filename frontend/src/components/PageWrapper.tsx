import { ReactNode } from "react";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" relative h-screen py-10">
      <div className="container py-4 px-4 mx-auto max-w-[432px] bg-white border border-gray rounded-2xl">
        {children}
      </div>
    </div>
  );
};
