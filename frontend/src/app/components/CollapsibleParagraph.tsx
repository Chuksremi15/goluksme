import { useState } from "react";

export const CollapsibleParagraph = ({
  text,
  maxLength = 100,
}: {
  text: string;
  maxLength?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  return (
    <div>
      <div className="text-base text-gray-600 mt-2 font-body flex flex-col gap-y-1">
        {isExpanded
          ? text.split("\n").map((line, i) => (
              <p className="" key={i}>
                {line}
              </p>
            ))
          : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
      </div>

      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          className="text-blue-500 text-sm font-semibold mt-1"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};
