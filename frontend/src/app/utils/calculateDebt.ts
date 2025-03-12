export function calculateDebt(params: {
  amount: bigint;
  timestamp: bigint;
  totalInterestRate: bigint;
  prevAccumulatedInterest: bigint;
}): bigint {
  const { amount, timestamp, totalInterestRate, prevAccumulatedInterest } =
    params;
  // Ensure all parameters are defined
  if (
    amount === undefined ||
    timestamp === undefined ||
    totalInterestRate === undefined ||
    prevAccumulatedInterest === undefined
  ) {
    throw new Error("All parameters must be defined");
  }

  // Convert interest rate to a decimal (assuming it's given in basis points, e.g., 1140 means 11.40%)
  const interestRateDecimal = totalInterestRate / 10000n;

  // Calculate the time difference in seconds (assuming timestamp is in seconds)
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const timeElapsed = currentTime - timestamp;

  // Calculate interest accrued since the last calculation
  const interestAccrued =
    (amount * interestRateDecimal * timeElapsed) / (365n * 24n * 60n * 60n);

  // Total debt is the initial amount plus the accrued interest and previous accumulated interest
  const totalDebt = amount + interestAccrued + prevAccumulatedInterest;

  return totalDebt;
}

// Example usage
// const amount = 1822870630n;
// const timestamp = 1740155618n;
// const totalInterestRate = 1140n;
// const prevAccumulatedInterest = 600n;

// const debt = calculateDebt({
//   amount,
//   timestamp,
//   totalInterestRate,
//   prevAccumulatedInterest
// });
// console.log(`Total Debt: ${debt}`);
