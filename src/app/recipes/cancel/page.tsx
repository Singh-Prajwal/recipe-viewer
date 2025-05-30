"use client";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-8 border-t-4 border-red-500 text-center">
        <svg
          className="h-16 w-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={2}
            fill="#fee2e2"
          />
          <path
            d="M15 9l-6 6m0-6l6 6"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Payment Cancelled
        </h1>
        <p className="mb-4 text-gray-700">
          Your payment was cancelled or not completed. Don&apos;t worry, you can
          try again or browse other recipes!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/`}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-5 py-3 font-semibold rounded-full"
          >
            Back to Recipe
          </Link>
          <Link
            href="/"
            className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 px-5 py-3 font-semibold rounded-full"
          >
            Explore More Recipes
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-6">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
