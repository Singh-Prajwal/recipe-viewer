// src/app/page.tsx
import { RecipeCard } from "@/components/RecipeCard";
import { recipes } from "@/data/recipes";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        Delicious Recipes Await!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
