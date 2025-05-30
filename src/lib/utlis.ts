export const getPaidRecipes = (): string[] => {
  if (typeof window === "undefined") return []; // Server-side check
  const paidRecipes = localStorage.getItem("paidRecipes");
  return paidRecipes ? JSON.parse(paidRecipes) : [];
};

export const addPaidRecipe = (recipeId: string): void => {
  if (typeof window === "undefined") return;
  const paidRecipes = getPaidRecipes();
  if (!paidRecipes.includes(recipeId)) {
    paidRecipes.push(recipeId);
    localStorage.setItem("paidRecipes", JSON.stringify(paidRecipes));
  }
};
