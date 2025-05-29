// src/types/index.ts (create this file for interfaces)
export interface Recipe {
  id: string;
  name: string;
  image: string; // Path to image in public folder
  shortDescription: string;
  ingredients: string[];
  steps: string[];
  priceInCents: number; // Price in cents for Stripe
}

// src/data/recipes.ts
import { Recipe } from "@/types";

export const recipes: Recipe[] = [
  {
    id: "pasta-carbonara",
    name: "Classic Pasta Carbonara",
    image: "/food1.jpg", // Adjust the path to your image in the public folder
    shortDescription:
      "A quick and delicious Italian classic with eggs, cheese, pancetta, and black pepper.",
    ingredients: [
      "200g spaghetti",
      "100g pancetta or guanciale",
      "2 large eggs",
      "50g Pecorino Romano cheese, grated",
      "Freshly ground black pepper",
      "Salt for pasta water",
    ],
    steps: [
      "Bring a large pot of salted water to a boil. Add spaghetti and cook according to package directions until al dente.",
      "While pasta cooks, cut pancetta into small cubes. Cook in a large skillet over medium heat until crispy. Remove pancetta, leaving rendered fat in the skillet.",
      "In a bowl, whisk eggs with grated Pecorino Romano and a generous amount of black pepper until well combined.",
      "Drain the spaghetti, reserving about 1 cup of pasta water. Add hot spaghetti directly to the skillet with the pancetta fat. Toss to coat.",
      "Quickly pour the egg mixture over the pasta, stirring vigorously to emulsify. Add a splash of reserved pasta water as needed to create a creamy sauce. The heat from the pasta will cook the eggs without scrambling them.",
      "Stir in the cooked pancetta. Serve immediately with extra Pecorino Romano and black pepper.",
    ],
    priceInCents: 999, // $9.99
  },
  {
    id: "chicken-tikka-masala",
    name: "Homemade Chicken Tikka Masala",
    image: "/food2.jpg",
    // "https://media.istockphoto.com/id/1127522508/photo/chicken-fillet-marinated-in-yoghurt-and-fried-in-tandoor-chiken-tikka-in-kadai-dish.jpg?s=1024x1024&w=is&k=20&c=7-Ww0W7mTBeyGOmE4zzh5yeuSfi5sFUjJuzViHTmuYw=",
    shortDescription:
      "Tender chicken pieces simmered in a rich, creamy, and aromatic tomato-based sauce.",
    ingredients: [
      "500g boneless, skinless chicken thighs or breast, cut into bite-sized pieces",
      "For Marinade: 1/2 cup plain yogurt, 1 tbsp ginger-garlic paste, 1 tsp turmeric, 1 tsp cumin, 1 tsp coriander, 1/2 tsp red chili powder, salt",
      "For Sauce: 1 tbsp oil, 1 large onion (chopped), 1 tbsp ginger-garlic paste, 1 tsp cumin, 1 tsp coriander, 1/2 tsp garam masala, 1 (400g) can crushed tomatoes, 1/2 cup heavy cream, 1/4 cup chopped fresh cilantro",
    ],
    steps: [
      "Marinate chicken: Combine chicken pieces with all marinade ingredients in a bowl. Cover and refrigerate for at least 30 minutes, preferably 2-4 hours.",
      "Cook chicken: Heat 1 tbsp oil in a large skillet over medium-high heat. Add marinated chicken in batches and cook until lightly browned and cooked through. Set aside.",
      "Prepare sauce: In the same skillet, add 1 tbsp oil (if needed). Add chopped onion and cook until softened and translucent, about 5-7 minutes. Add ginger-garlic paste and cook for another minute until fragrant.",
      "Add spices: Stir in cumin, coriander, and garam masala. Cook for 30 seconds until aromatic.",
      "Add tomatoes: Pour in crushed tomatoes. Bring to a simmer, then reduce heat and cook for 10-15 minutes, stirring occasionally, until the sauce thickens and oil separates.",
      "Combine: Stir in the cooked chicken. Reduce heat to low, stir in heavy cream, and simmer for 5 minutes, allowing flavors to meld. Do not boil after adding cream.",
      "Garnish: Garnish with fresh cilantro before serving with rice or naan.",
    ],
    priceInCents: 1499, // $14.99
  },
  {
    id: "vegetable-stir-fry",
    name: "Quick Vegetable Stir-Fry",
    image: "/food3.jpg",
    // "https://media.istockphoto.com/id/928823336/photo/grilled-chicken-breast-fried-chicken-fillet-and-fresh-vegetable-salad-of-tomatoes-cucumbers.jpg?s=1024x1024&w=is&k=20&c=MRmsj1qzqAKakantY-lqn_f8FrdWont_ZYhBysHIfDA=",
    shortDescription:
      "A vibrant and healthy stir-fry with a variety of vegetables and a savory sauce.",
    ingredients: [
      "1 tbsp sesame oil",
      "1 cup broccoli florets",
      "1 cup sliced bell peppers (any color)",
      "1 cup snap peas",
      "1 cup sliced carrots",
      "2 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "For Sauce: 2 tbsp soy sauce, 1 tbsp oyster sauce (optional), 1 tsp cornstarch, 1/4 cup vegetable broth",
    ],
    steps: [
      "Prepare sauce: In a small bowl, whisk together soy sauce, oyster sauce (if using), cornstarch, and vegetable broth. Set aside.",
      "Heat oil: Heat sesame oil in a large wok or skillet over high heat until shimmering.",
      "Stir-fry hard vegetables: Add broccoli and carrots. Stir-fry for 3-4 minutes until slightly tender-crisp.",
      "Add softer vegetables: Add bell peppers, snap peas, minced garlic, and grated ginger. Stir-fry for another 2-3 minutes until vegetables are bright and tender-crisp.",
      "Add sauce: Give the sauce mixture a quick whisk again and pour it into the wok. Stir constantly for 1-2 minutes until the sauce thickens and coats the vegetables.",
      "Serve immediately: Serve hot with steamed rice or noodles.",
    ],
    priceInCents: 799, // $7.99
  },
];
