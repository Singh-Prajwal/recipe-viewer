"use client";
import { useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";
import { recipes } from "@/data/recipes";

export default function RecipesListPage() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  console.log("selectedRecipeId", selectedRecipeId);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelectedRecipeId(recipe.id)}
          />
        ))}
      </div>
      {selectedRecipeId && (
        <RecipeDetailModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </>
  );
}
