// src/components/RecipeCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative w-full h-48">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true} // Prioritize LCP images
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {recipe.name}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {recipe.shortDescription}
          </p>
          <div className="mt-3 text-lg font-bold text-indigo-600">
            ${(recipe.priceInCents / 100).toFixed(2)}
          </div>
          <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-colors duration-200">
            View Recipe
          </button>
        </div>
      </div>
    </Link>
  );
}
