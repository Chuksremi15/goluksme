import { ReactNode } from "react";
import { Navbar } from "../header/Navbar";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" relative h-screen  ">
      <div
        style={{ scrollbarWidth: "none" }}
        className="container h-full overflow-scroll py-4 px-4 mx-auto max-w-[432px] bg-white border border-gray rounded"
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
};
