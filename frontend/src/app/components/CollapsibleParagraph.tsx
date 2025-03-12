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
      <p className="text-sm text-gray-600 mt-2 font-body">
        {isExpanded
          ? text
          : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
      </p>

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
