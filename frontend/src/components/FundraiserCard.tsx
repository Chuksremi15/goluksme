import { Link } from "react-router-dom";

interface FundraiserCardProps {
  image: string;
  name: string;
  raisedAmount: number;
  targetAmount: number;
  progress: number;
}

export const FundraiserCard: React.FC<FundraiserCardProps> = ({
  image,
  name,
  raisedAmount,
  targetAmount,
  progress,
}) => {
  return (
    <Link to={`/campaign/${name}`} className="block">
      <div className="max-w-[200px] rounded-xl overflow-hidden border border-gray-200 shadow hover:shadow-lg transition-all duration-300">
        <img
          src={image}
          alt={`${name}'s fundraiser`}
          className="hover:scale-105 transition-all duration-500"
        />
        <div className="p-4">
          <h3 className="text-lg font-body">{name}</h3>
          <div className="mt-4 font-body">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Raised Target
              </span>
              <span className="text-sm font-medium text-gray-700">
                ${raisedAmount.toLocaleString()} $
                {targetAmount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-pink h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
