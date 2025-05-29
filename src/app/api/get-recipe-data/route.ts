// src/app/api/get-recipe-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { recipes } from "@/data/recipes";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get("recipe_id");

  if (!recipeId) {
    return NextResponse.json(
      { message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
  }

  // Return only necessary data, perhaps omitting sensitive parts if any
  // For a recipe, all parts are likely fine.
  return NextResponse.json(recipe);
}
