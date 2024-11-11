// src/app/models/gift-idea.model.ts

export interface GiftIdea {
  id: number;
  idea: string;
  link?: string;
  price?: number;
  occasion?: string;
  person_name?: string;
  is_offered: boolean;
}
