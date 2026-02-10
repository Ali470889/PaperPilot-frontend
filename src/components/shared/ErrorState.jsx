import { AlertTriangle, RefreshCcw } from "lucide-react";

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center border rounded-md ">
      <AlertTriangle className="h-12 w-12 text-red-600 mb-3" />

      <h2 className="text-lg font-semibold text-red-700">
        Something went wrong
      </h2>

      <p className="text-sm text-red-600 mb-4">
        {message || "Unable to load quizzes."}
      </p>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
};
