"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { recipes } from "@/data/recipes";
import { getPaidRecipes, addPaidRecipe } from "../../../lib/utlis";
import { Recipe } from "@/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Find the recipe based on ID
    const foundRecipe = recipes.find((r) => r.id === id);
    if (foundRecipe) {
      setRecipe(foundRecipe);
      // Check if this recipe has been "paid" for in localStorage
      const paidRecipes = getPaidRecipes();
      setHasPaid(paidRecipes.includes(foundRecipe.id));
    } else {
      setError("Recipe not found.");
    }
    setLoading(false);
  }, [id]);

  const handleShowFullRecipe = async () => {
    if (!recipe) return;

    setPaymentProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: recipe.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          setError(error.message || "Error redirecting to checkout");
        }
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message || "An unexpected error occurred during payment.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading recipe...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-bold text-lg">
        {error}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-10 text-gray-600">
        Recipe data not available.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          {recipe.name}
        </h1>

        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            priority
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          {hasPaid ? (
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-600 text-lg mb-4">
                Full recipe steps are hidden. Make a dummy payment to unlock!
              </p>
              <button
                onClick={handleShowFullRecipe}
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
      </div>
    </div>
  );
}
