// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { recipes } from "@/data/recipes";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const { recipeId } = await req.json();

    const recipe = recipes.find((r) => r.id === recipeId);

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Unlock Recipe: ${recipe.name}`,
              description: "Access to full recipe steps.",
            },
            unit_amount: recipe.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Pass recipeId back to success page
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/recipes/success?session_id={CHECKOUT_SESSION_ID}&recipe_id=${recipe.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/recipes/${recipe.id}`,
      metadata: {
        recipeId: recipe.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
