interface CircularProgressBarProps {
  percentage: number; // Progress percentage (0 - 100)
  size: number; // Size of the circle (in pixels)
  strokeWidth: number; // Width of the progress stroke
  color?: string; // Color of the progress stroke
  label?: string; // Optional label inside the circle
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size,
  strokeWidth,
  color = "text-blue-500",
  label = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background Circle (Gray) */}
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`text-[#F2F2F2]`}
          fill="none"
          stroke="#F2F2F2"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color}`}
          strokeLinecap="round"
          stroke="currentColor"
        />
      </svg>
    </div>
  );
};
