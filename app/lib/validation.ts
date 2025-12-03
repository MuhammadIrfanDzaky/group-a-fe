import { z } from 'zod';

// Review submission schema
export const reviewSchema = z.object({
  reviewer_name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .trim()
    .refine((val) => val.length > 0, 'Name cannot be empty'),
  review_text: z
    .string()
    .min(6, 'Review must be at least 6 characters')    
    .max(200, 'Review must be less than 200 characters')
    .trim()
    .refine((val) => val.length >= 6, 'Review must be at least 6 characters'),
});

// Product ID schema
export const productIdSchema = z
  .string()
  .min(1, 'Product ID is required')
  .regex(/^\d+$/, 'Product ID must be a number');

// API Response schemas
export const productResponseSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  image: z.string().url().or(z.string()),
  total: z.number().min(0).default(0),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;

