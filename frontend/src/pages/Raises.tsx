import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import { FundraiserCard } from "../components/FundraiserCard";
import { Link } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";

const Raises = () => {
  return (
    <PageWrapper>
      <div>
        <Link to="/create">
          <div className="ml-auto flex font-semibold justify-center items-center text-sm border p-2 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500">
            Start a GoluksMe
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <FundraiserCard
          image={img1}
          name="Christopher potter"
          raisedAmount={5000}
          targetAmount={10000}
          progress={90}
        />
        <FundraiserCard
          image={img2}
          name="Christopher potter"
          raisedAmount={5000}
          targetAmount={10000}
          progress={90}
        />
        <FundraiserCard
          image={img3}
          name="Christopher potter"
          raisedAmount={5000}
          targetAmount={10000}
          progress={90}
        />
        <FundraiserCard
          image={img4}
          name="Christopher potter"
          raisedAmount={5000}
          targetAmount={10000}
          progress={90}
        />
      </div>
    </PageWrapper>
  );
};

export default Raises;
