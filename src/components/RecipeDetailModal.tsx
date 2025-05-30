// src/components/RecipeDetailModal.tsx
"use client";
import { useEffect, useState } from "react";
import { recipes } from "@/data/recipes";
import { getPaidRecipes, addPaidRecipe } from "@/lib/utlis";
import { loadStripe } from "@stripe/stripe-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Set your Stripe publishable key (ensure env var is exposed)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface RecipeDetailModalProps {
  recipeId: string | null;
  onClose: () => void;
}

export function RecipeDetailModal({
  recipeId,
  onClose,
}: RecipeDetailModalProps) {
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;
    setError(null);
    setDownloadError(null);
    setPaymentProcessing(false);
    setDownloading(false);
    // Check localStorage for payment
    setHasPaid(getPaidRecipes().includes(recipeId));
  }, [recipeId]);

  if (!recipeId) return null;

  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe)
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-[90vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <div>Recipe not found.</div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );

  const handleUnlockRecipe = async () => {
    setPaymentProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to create checkout session");

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (error) setError(error.message || "Error redirecting to checkout");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during payment.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // For demo: Listen for "success" query param and mark as paid
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    // simulate Stripe return: ?success=1&recipe_id=abc123
    if (
      url.searchParams.get("success") === "1" &&
      url.searchParams.get("recipe_id") === recipe.id
    ) {
      addPaidRecipe(recipe.id); // Mark as paid in localStorage
      setHasPaid(true);
      // Clean up URL for better UX
      url.searchParams.delete("success");
      url.searchParams.delete("recipe_id");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [recipe.id]);

  const handleDownloadPdf = async () => {
    if (!recipe) {
      setDownloadError("Recipe data not available for PDF generation.");
      return;
    }
    setDownloading(true);
    setDownloadError(null);
    try {
      const contentDiv = document.createElement("div");
      contentDiv.style.width = "700px";
      contentDiv.style.margin = "0";
      contentDiv.style.padding = "0";
      contentDiv.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #faf7f2 0%, #f6fafd 100%);
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(90, 129, 170, 0.15);
          font-family: 'Lora', serif;
          padding: 48px 36px;
          max-width: 600px;
          margin: 32px auto;
          color: #222;
        ">
          <h1 style="font-family: 'Lora', serif; font-size: 2.3rem; font-weight: 700; color: #FF7043; text-align: center; margin-bottom: 8px; letter-spacing:0.5px;">
            ${recipe.name}
          </h1>
          <p style="font-size: 1.15rem; text-align: center; color:#555; margin-bottom: 22px; font-family: 'Inter', sans-serif;">
            ${recipe.shortDescription}
          </p>
          <hr style="border:none; border-top:1.5px solid #FF704380; margin:24px 0 12px;" />
          <h2 style="font-size: 1.2rem; font-weight: 600; color: #66BB6A; font-family:'Lora',serif; margin-bottom:10px; letter-spacing:1px;">
            Ingredients
          </h2>
          <ul style="font-size: 1.08rem; margin-bottom: 20px; padding-left: 18px; color:#333; font-family:'Inter',sans-serif;">
            ${recipe.ingredients
              .map(
                (item) =>
                  `<li style="margin-bottom: 7px; line-height: 1.5;"><span style="background:#fffbe6; padding:1.5px 8px;border-radius:12px;">${item}</span></li>`
              )
              .join("")}
          </ul>
          <h2 style="font-size: 1.2rem; font-weight: 600; color: #66BB6A; font-family:'Lora',serif; margin-bottom:10px; letter-spacing:1px;">
            Instructions
          </h2>
          <ol style="font-size: 1.05rem; color:#39424e; margin-left:22px; font-family:'Inter',sans-serif;">
            ${recipe.steps
              .map(
                (step, idx) =>
                  `<li style="margin-bottom: 15px; line-height:1.7;"><span style="background:#e1f5e5; padding:2px 7px; border-radius:8px; margin-right:8px; color:#218c54; font-weight:500;">Step ${
                    idx + 1
                  }:</span> ${step}</li>`
              )
              .join("")}
          </ol>
          <hr style="border:none; border-top:1px dashed #bababa80; margin:30px 0 10px;" />
          <p style="text-align:center; font-size:0.95rem; color:#999; margin-top:22px;">
            © ${new Date().getFullYear()} YourBrandName. Recipe PDF generated for you.
          </p>
        </div>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lora:wght@700&display=swap" rel="stylesheet">
      `;

      document.body.appendChild(contentDiv);

      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      contentDiv.remove();

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgRatio = imgProps.width / imgProps.height;
      let imgWidth = pdfWidth * 0.87;
      let imgHeight = imgWidth / imgRatio;
      let yMargin = (pdfHeight - imgHeight) / 2;
      if (imgHeight > pdfHeight * 0.96) {
        imgHeight = pdfHeight * 0.96;
        imgWidth = imgHeight * imgRatio;
        yMargin = (pdfHeight - imgHeight) / 2;
      }
      pdf.addImage(
        imgData,
        "PNG",
        (pdfWidth - imgWidth) / 2,
        yMargin,
        imgWidth,
        imgHeight
      );
      pdf.save(`${recipe.name.replace(/\s/g, "_")}_Recipe.pdf`);
    } catch (error: any) {
      setDownloadError(
        error.message || "An unexpected error occurred during PDF download."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 text-black bg-black/60 flex items-center justify-center">
      <div
        className="
          bg-white
          rounded
          shadow-lg
          relative
          w-[90vw] max-w-lg max-h-[90vh] overflow-y-auto
          p-6 sm:p-8
        "
      >
        <button
          className="absolute top-3 right-3 text-lg font-bold hover:text-red-500 outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-3 text-center break-words">
          {recipe.name}
        </h2>
        <img
          src={recipe.image}
          alt={recipe.name}
          className="my-4 mx-auto max-h-40 w-full object-cover rounded-md"
          style={{ maxWidth: "100%" }}
        />
        <p className="mb-4 text-gray-700 text-center">
          {recipe.shortDescription}
        </p>

        <div className="mb-5">
          <b className="block text-indigo-600 mb-2">Ingredients:</b>
          <ul className="list-disc pl-6">
            {recipe.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>

        <div>
          <b className="block text-indigo-600 mb-2">Instructions:</b>
          {hasPaid ? (
            <ol className="list-decimal pl-6 space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-700 text-lg mb-4">
                Full recipe steps are hidden. Make a payment to unlock!
              </p>
              <button
                onClick={handleUnlockRecipe}
                disabled={paymentProcessing}
                className="bg-green-600 text-white text-lg font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentProcessing
                  ? "Processing Payment..."
                  : `Unlock Recipe for $${(recipe.priceInCents / 100).toFixed(
                      2
                    )}`}
              </button>
              {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>
          )}
        </div>

        {/* PDF Download: Only after payment */}
        {hasPaid && (
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            {downloading ? "Downloading PDF..." : "Download Recipe PDF"}
          </button>
        )}
        {downloadError && (
          <p className="text-red-500 text-sm mt-2">{downloadError}</p>
        )}
      </div>
    </div>
  );
}
// // src/components/RecipeDetailModal.tsx
// import { recipes } from "@/data/recipes";
// // import { Recipe } from "@types";

// interface RecipeDetailModalProps {
//   recipeId: string | null;
//   onClose: () => void;
// }

// export function RecipeDetailModal({
//   recipeId,
//   onClose,
// }: RecipeDetailModalProps) {
//   if (!recipeId) return null;

//   const recipe = recipes.find((r) => r.id === recipeId);
//   if (!recipe)
//     return (
//       <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//         <div className="bg-white p-6 rounded shadow-lg w-[90vw] max-w-lg max-h-[90vh] overflow-y-auto">
//           <div>Recipe not found.</div>
//           <button
//             onClick={onClose}
//             className="mt-4 px-4 py-2 bg-gray-300 rounded"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 text-black flex items-center justify-center">
//       <div
//         className="
//           bg-white
//           rounded
//           shadow-lg
//           relative
//           w-[90vw]         // Max 90% viewport width (responsive)
//           max-w-lg         // Never wider than lg (Tailwind, ≈32rem)
//           max-h-[90vh]     // At most 90% viewport height
//           overflow-y-auto  // Scroll inside modal if overflow
//           p-6 sm:p-8
//         "
//       >
//         <button
//           className="absolute top-3 right-3 text-lg font-bold hover:text-red-500 outline-none"
//           onClick={onClose}
//           aria-label="Close modal"
//         >
//           ×
//         </button>
//         <h2 className="text-2xl font-bold mb-3 text-center break-words">
//           {recipe.name}
//         </h2>
//         <img
//           src={recipe.image}
//           alt={recipe.name}
//           className="my-4 mx-auto max-h-40 w-full object-cover rounded-md"
//           style={{ maxWidth: "100%" }}
//         />
//         <p className="mb-4 text-gray-700 text-center">
//           {recipe.shortDescription}
//         </p>
//         <div className="mb-5">
//           <b className="block text-indigo-600 mb-2">Ingredients:</b>
//           <ul className="list-disc pl-6">
//             {recipe.ingredients.map((ing) => (
//               <li key={ing}>{ing}</li>
//             ))}
//           </ul>
//         </div>
//         <div>
//           <b className="block text-indigo-600 mb-2">Instructions:</b>
//           <ol className="list-decimal pl-6 space-y-2">
//             {recipe.steps.map((step, i) => (
//               <li key={i}>{step}</li>
//             ))}
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }
