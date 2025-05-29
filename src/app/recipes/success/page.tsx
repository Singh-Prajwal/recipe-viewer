// src/app/recipes/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addPaidRecipe } from "../../../lib/utlis";
import Link from "next/link";
import { Recipe } from "@/types"; // Import Recipe interface
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null); // To store fetched recipe
  const [processing, setProcessing] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const rId = searchParams.get("recipe_id");
    if (rId) {
      setRecipeId(rId);
      addPaidRecipe(rId); // Mark recipe as paid in localStorage
      fetchRecipeData(rId); // Fetch recipe details for PDF generation
    } else {
      router.replace("/");
    }
  }, [searchParams, router]);

  const fetchRecipeData = async (id: string) => {
    try {
      const response = await fetch(`/api/get-recipe-data?recipe_id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe data.");
      }
      const data: Recipe = await response.json();
      setRecipeData(data);
    } catch (error: any) {
      console.error("Error fetching recipe data:", error);
      setDownloadError("Could not load recipe details for PDF.");
    } finally {
      setProcessing(false);
    }
  };

  //   const handleDownloadPdf = async () => {
  //     if (!recipeData) {
  //       setDownloadError("Recipe data not available for PDF generation.");
  //       return;
  //     }

  //     setDownloading(true);
  //     setDownloadError(null);

  //     try {
  //       // Create a temporary element to render the recipe content for html2canvas
  //       // This avoids rendering it directly to the visible DOM
  //       const contentDiv = document.createElement("div");
  //       contentDiv.style.width = "800px"; // Set a consistent width for PDF layout
  //       contentDiv.style.padding = "30px";
  //       contentDiv.style.backgroundColor = "white";
  //       contentDiv.innerHTML = `
  //       <div style="
  //   max-width: 600px;
  //   margin: 40px auto;
  //   padding: 30px;
  //   border-radius: 16px;
  //   color:black;
  //   border: 1px solid #eee;
  //   box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  //   font-family: 'Inter', sans-serif;
  //   background-color: #fff;
  //   transition: transform 0.3s ease;
  // ">
  //   <h1 style="
  //     font-family: 'Lora', serif;
  //     font-size: 28px;
  //     font-weight: bold;
  //     color: #FF7043;
  //     text-align: center;
  //     margin-bottom: 20px;
  //   ">
  //     ${recipeData.name}
  //   </h1>

  //   <p style="font-size: 14px; margin-bottom: 20px; text-align: center;">
  //     ${recipeData.shortDescription}
  //   </p>

  //   <h2 style="
  //     font-size: 20px;
  //     font-weight: bold;
  //     margin-bottom: 10px;
  //     color: #66BB6A;
  //     font-family: 'Lora', serif;
  //   ">
  //     Ingredients:
  //   </h2>
  //   <ul style="list-style: disc; margin-left: 20px; margin-bottom: 20px;">
  //     ${recipeData.ingredients
  //       .map(
  //         (item) =>
  //           `<li style="font-size: 14px; margin-bottom: 6px;">${item}</li>`
  //       )
  //       .join("")}
  //   </ul>

  //   <h2 style="
  //     font-size: 20px;
  //     font-weight: bold;
  //     margin-bottom: 10px;
  //     color: #66BB6A;
  //     font-family: 'Lora', serif;
  //   ">
  //     Instructions:
  //   </h2>
  //   <ol style="list-style: decimal; margin-left: 20px;">
  //     ${recipeData.steps
  //       .map(
  //         (step) =>
  //           `<li style="font-size: 14px; margin-bottom: 10px;">${step}</li>`
  //       )
  //       .join("")}
  //   </ol>

  //   <div style="text-align: center; margin-top: 30px;">
  //     <button style="
  //       font-size: 14px;
  //       padding: 10px 20px;
  //       border: 1px solid #FF7043;
  //       border-radius: 8px;
  //       background-color: transparent;
  //       color: #FF7043;
  //       cursor: pointer;
  //       transition: all 0.3s ease;
  //       font-family: 'Inter', sans-serif;
  //     " onmouseover="this.style.backgroundColor='#FF7043'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#FF7043';">
  //       Save Recipe
  //     </button>
  //   </div>
  // </div>

  // <!-- Add Google Fonts -->
  // <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lora&display=swap" rel="stylesheet">

  // `;

  //       document.body.appendChild(contentDiv); // Temporarily append to body to be rendered by html2canvas

  //       const canvas = await html2canvas(contentDiv, {
  //         scale: 2, // Higher scale for better resolution
  //         logging: false, // Suppress console logging from html2canvas
  //         useCORS: true, // Important if you have images from external domains
  //       });

  //       const imgData = canvas.toDataURL("image/png");
  //       const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for units, 'a4' for size
  //       const imgWidth = 210; // A4 width in mm
  //       const pageHeight = 297; // A4 height in mm
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       let heightLeft = imgHeight;
  //       let position = 0;

  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       contentDiv.remove(); // Remove the temporary element

  //       pdf.save(`${recipeData.name.replace(/\s/g, "_")}_Recipe.pdf`);
  //     } catch (error: any) {
  //       console.error("PDF download error:", error);
  //       setDownloadError(
  //         error.message || "An unexpected error occurred during PDF download."
  //       );
  //     } finally {
  //       setDownloading(false);
  //     }
  //   };

  const handleDownloadPdf = async () => {
    if (!recipeData) {
      setDownloadError("Recipe data not available for PDF generation.");
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      // SVG icon: Cooking hat (base64-encoded for html2canvas compatibility)
      const chefHatIcon = `<img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkY3MDQzIiB2aWV3Qm94PSIwIDAgMjQwIDI0MCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMCIgcj0iOSIgdG9sZXJhbmNlPSI0Ii8+PHBhdGggZD0iTTEyMCA3OGMtMzguNiAwLTcwIDMxLjQtNzAgNzBIMTIwYTEwIDEwIDAgMTAwIDIwaDQwYzAtMzguNi0zMS40LTcwLTcwLTd6IiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+" alt="Chef Hat" style="display:block;width:48px;margin:0 auto 20px auto;" />`;

      // Improved card design
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
        ${chefHatIcon}
        <h1 style="font-family: 'Lora', serif; font-size: 2.3rem; font-weight: 700; color: #FF7043; text-align: center; margin-bottom: 8px; letter-spacing:0.5px;">
          ${recipeData.name}
        </h1>
        <p style="font-size: 1.15rem; text-align: center; color:#555; margin-bottom: 22px; font-family: 'Inter', sans-serif;">
          ${recipeData.shortDescription}
        </p>
        <hr style="border:none; border-top:1.5px solid #FF704380; margin:24px 0 12px;" />
        <h2 style="font-size: 1.2rem; font-weight: 600; color: #66BB6A; font-family:'Lora',serif; margin-bottom:10px; letter-spacing:1px;">
          Ingredients
        </h2>
        <ul style="font-size: 1.08rem; margin-bottom: 20px; padding-left: 18px; color:#333; font-family:'Inter',sans-serif;">
          ${recipeData.ingredients
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
          ${recipeData.steps
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
          © ${new Date().getFullYear()} Recipe Viewer.
        </p>
      </div>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lora:wght@700&display=swap" rel="stylesheet">
    `;

      document.body.appendChild(contentDiv);

      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        backgroundColor: null, // Keep background transparent for PDF card shadow
        useCORS: true,
        logging: false,
      });
      contentDiv.remove();

      // A4 calculations
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = imgProps.width / imgProps.height;
      let imgWidth = pdfWidth * 0.87; // Leave margin
      let imgHeight = imgWidth / imgRatio;
      let yMargin = (pdfHeight - imgHeight) / 2;
      if (imgHeight > pdfHeight * 0.96) {
        // Too tall, fit on page
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

      pdf.save(`${recipeData.name.replace(/\s/g, "_")}_Recipe.pdf`);
    } catch (error: any) {
      setDownloadError(
        error.message || "An unexpected error occurred during PDF download."
      );
    } finally {
      setDownloading(false);
    }
  };
  if (processing) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">
            Processing Payment...
          </h1>
          <p className="text-gray-700">
            Please wait while we confirm your transaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-green-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md border-t-4 border-green-500">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Thank you for your purchase. The recipe steps are now unlocked!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          {recipeId && (
            <Link
              href={`/recipes/${recipeId}`}
              className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300"
            >
              Go to Recipe
            </Link>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={downloading || !recipeData} // Disable if no recipeData
            className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Downloading PDF...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l3-3m-3 3l-3-3m2.81 2.81A9 9 0 105.19 12H4.01C5.17 6.4 10.3 2 16 2z"
                  ></path>
                </svg>
                Download Recipe PDF
              </>
            )}
          </button>
          {downloadError && (
            <p className="text-red-500 text-sm mt-2">{downloadError}</p>
          )}
        </div>

        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300 mt-4"
        >
          Explore More Recipes
        </Link>
      </div>
    </div>
  );
}
// // src/app/recipes/success/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { addPaidRecipe } from "../../../lib/utlis";
// import Link from "next/link";

// export default function PaymentSuccessPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [recipeId, setRecipeId] = useState<string | null>(null);
//   const [processing, setProcessing] = useState(true);
//   const [downloading, setDownloading] = useState(false);
//   const [downloadError, setDownloadError] = useState<string | null>(null);

//   useEffect(() => {
//     const rId = searchParams.get("recipe_id");
//     const sessionId = searchParams.get("session_id"); // Can be used for server-side verification if needed

//     if (rId) {
//       setRecipeId(rId);
//       addPaidRecipe(rId); // Mark recipe as paid in localStorage
//       setProcessing(false);
//     } else {
//       // If no recipe ID in the URL, redirect to home or an error page
//       router.replace("/");
//     }
//   }, [searchParams, router]);

//   const handleDownloadPdf = async () => {
//     if (!recipeId) {
//       setDownloadError("Recipe ID not available for download.");
//       return;
//     }

//     setDownloading(true);
//     setDownloadError(null); // Clear previous errors

//     try {
//       // Call the API route to generate and retrieve the PDF
//       const response = await fetch(
//         `/api/generate-recipe-pdf?recipe_id=${recipeId}`
//       );

//       if (!response.ok) {
//         // Attempt to read error message from response body if available
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`
//         );
//       }

//       // Get the PDF content as a Blob
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob

//       // Create a hidden link element to trigger the download
//       const a = document.createElement("a");
//       a.href = url;
//       // Extract filename from Content-Disposition header if possible, otherwise use a default
//       const contentDisposition = response.headers.get("Content-Disposition");
//       let filename = `${recipeId}_recipe.pdf`; // Default filename
//       if (contentDisposition) {
//         const filenameMatch = /filename="([^"]+)"/.exec(contentDisposition);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1];
//         }
//       }
//       a.download = filename;
//       document.body.appendChild(a); // Append to body to ensure it's clickable
//       a.click(); // Programmatically click the link to start download
//       a.remove(); // Clean up the link element
//       window.URL.revokeObjectURL(url); // Release the temporary URL object
//     } catch (error: any) {
//       console.error("PDF download error:", error);
//       setDownloadError(
//         error.message || "An unexpected error occurred during PDF download."
//       );
//     } finally {
//       setDownloading(false);
//     }
//   };

//   if (processing) {
//     return (
//       <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50">
//         <div className="text-center p-8 bg-white rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold text-indigo-600 mb-4">
//             Processing Payment...
//           </h1>
//           <p className="text-gray-700">
//             Please wait while we confirm your transaction.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-green-50">
//       <div className="text-center p-8 bg-white rounded-lg shadow-md border-t-4 border-green-500">
//         <svg
//           className="mx-auto h-16 w-16 text-green-500"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//           ></path>
//         </svg>
//         <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
//           Payment Successful!
//         </h1>
//         <p className="text-gray-600 text-lg mb-6">
//           Thank you for your purchase. The recipe steps are now unlocked!
//         </p>

//         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
//           {recipeId && (
//             <Link
//               href={`/recipes/${recipeId}`}
//               className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300"
//             >
//               Go to Recipe
//             </Link>
//           )}

//           <button
//             onClick={handleDownloadPdf}
//             disabled={downloading || !recipeId}
//             className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {downloading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Downloading PDF...
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 10v6m0 0l3-3m-3 3l-3-3m2.81 2.81A9 9 0 105.19 12H4.01C5.17 6.4 10.3 2 16 2z"
//                   ></path>
//                 </svg>
//                 Download Recipe PDF
//               </>
//             )}
//           </button>
//           {downloadError && (
//             <p className="text-red-500 text-sm mt-2">{downloadError}</p>
//           )}
//         </div>

//         <Link
//           href="/"
//           className="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300 mt-4"
//         >
//           Explore More Recipes
//         </Link>
//       </div>
//     </div>
//   );
// }
// // src/app/recipes/success/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { addPaidRecipe } from '@/lib/utils';
// import Link from 'next/link';

// export default function PaymentSuccessPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [recipeId, setRecipeId] = useState<string | null>(null);
//   const [processing, setProcessing] = useState(true);
//   const [downloading, setDownloading] = useState(false);
//   const [downloadError, setDownloadError] = useState<string | null>(null);

//   useEffect(() => {
//     const rId = searchParams.get('recipe_id');
//     const sessionId = searchParams.get('session_id'); // Can be used for server-side verification if needed

//     if (rId) {
//       setRecipeId(rId);
//       addPaidRecipe(rId); // Mark recipe as paid in localStorage
//       setProcessing(false);
//     } else {
//       // If no recipe ID in the URL, redirect to home or an error page
//       router.replace('/');
//     }
//   }, [searchParams, router]);

//   const handleDownloadPdf = async () => {
//     if (!recipeId) {
//       setDownloadError("Recipe ID not available for download.");
//       return;
//     }

//     setDownloading(true);
//     setDownloadError(null); // Clear previous errors

//     try {
//       // Call the API route to generate and retrieve the PDF
//       const response = await fetch(`/api/generate-recipe-pdf?recipe_id=${recipeId}`);

//       if (!response.ok) {
//         // Attempt to read error message from response body if available
//         const errorText = await response.text();
//         throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
//       }

//       // Get the PDF content as a Blob
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob

//       // Create a hidden link element to trigger the download
//       const a = document.createElement('a');
//       a.href = url;
//       // Extract filename from Content-Disposition header if possible, otherwise use a default
//       const contentDisposition = response.headers.get('Content-Disposition');
//       let filename = `${recipeId}_recipe.pdf`; // Default filename
//       if (contentDisposition) {
//         const filenameMatch = /filename="([^"]+)"/.exec(contentDisposition);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1];
//         }
//       }
//       a.download = filename;
//       document.body.appendChild(a); // Append to body to ensure it's clickable
//       a.click(); // Programmatically click the link to start download
//       a.remove(); // Clean up the link element
//       window.URL.revokeObjectURL(url); // Release the temporary URL object

//     } catch (error: any) {
//       console.error('PDF download error:', error);
//       setDownloadError(error.message || "An unexpected error occurred during PDF download.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   if (processing) {
//     return (
//       <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50">
//         <div className="text-center p-8 bg-white rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold text-indigo-600 mb-4">Processing Payment...</h1>
//           <p className="text-gray-700">Please wait while we confirm your transaction.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-green-50">
//       <div className="text-center p-8 bg-white rounded-lg shadow-md border-t-4 border-green-500">
//         <svg
//           className="mx-auto h-16 w-16 text-green-500"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//           ></path>
//         </svg>
//         <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Payment Successful!</h1>
//         <p className="text-gray-600 text-lg mb-6">
//           Thank you for your purchase. The recipe steps are now unlocked!
//         </p>

//         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
//           {recipeId && (
//             <Link
//               href={`/recipes/${recipeId}`}
//               className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300"
//             >
//               Go to Recipe
//             </Link>
//           )}

//           <button
//             onClick={handleDownloadPdf}
//             disabled={downloading || !recipeId}
//             className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {downloading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Downloading PDF...
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l3-3m-3 3l-3-3m2.81 2.81A9 9 0 105.19 12H4.01C5.17 6.4 10.3 2 16 2z"></path></svg>
//                 Download Recipe PDF
//               </>
//             )}
//           </button>
//           {downloadError && <p className="text-red-500 text-sm mt-2">{downloadError}</p>}
//         </div>

//         <Link
//           href="/"
//           className="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300 mt-4"
//         >
//           Explore More Recipes
//         </Link>
//       </div>
//     </div>
//   );
// }
