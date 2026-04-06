import type { Category } from './useCases';

export interface CategoryMeta {
  name: Category;
  color: string; // Hex for DOM (badges, pills)
}

export const CATEGORIES: CategoryMeta[] = [
  { name: 'Personal',     color: '#FF6B9D' },
  { name: 'Business',     color: '#0071E3' },
  { name: 'Writing',      color: '#FF9F0A' },
  { name: 'Technical',    color: '#30D158' },
  { name: 'Creativity',   color: '#BF5AF2' },
  { name: 'Productivity', color: '#64D2FF' },
];

export const CATEGORY_COLOR: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.name, c.color])
) as Record<Category, string>;
