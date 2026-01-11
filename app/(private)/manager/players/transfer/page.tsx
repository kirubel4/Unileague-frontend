import { Suspense } from "react";
import TransferClient from "./transferPage";

export default function TransferPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Loading team information...</p>
          </div>
        </div>
      }
    >
      <TransferClient />
    </Suspense>
  );
}
