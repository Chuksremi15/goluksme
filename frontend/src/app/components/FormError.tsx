import { ErrorIcon } from "react-hot-toast";

export const FormError = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center mt-2 text-red-500 text-xs font-body font-light transition-all duration-500">
      <ErrorIcon className="mr-2 h-4 text-red-500 fill-current" />
      <p>{message}</p>
    </div>
  );
};
