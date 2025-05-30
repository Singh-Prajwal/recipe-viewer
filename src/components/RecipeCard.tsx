import { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative w-full h-48">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="object-cover w-full h-full"
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
        <div className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md text-center">
          View Recipe
        </div>
      </div>
    </button>
  );
}
