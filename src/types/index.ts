// src/types/index.ts
export interface Recipe {
  id: string;
  name: string;
  image: string; // Path to image in public folder
  shortDescription: string;
  ingredients: string[];
  steps: string[];
  priceInCents: number; // Price in cents for Stripe
}
