import React, { Suspense } from "react";
import SuccessPage from "./SuccessPage";

export default function SucessPage() {
  return (
    <div>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <SuccessPage />
      </Suspense>
    </div>
  );
}
