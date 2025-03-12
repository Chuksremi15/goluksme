import { ReactNode } from "react";
import { Navbar } from "../header/Navbar";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" relative h-screen py-10 ">
      <div
        style={{ scrollbarWidth: "none" }}
        className="container h-[90vh] overflow-scroll py-4 px-4 mx-auto max-w-[432px] bg-white border border-gray rounded-2xl"
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
};
