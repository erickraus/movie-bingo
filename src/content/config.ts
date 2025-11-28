import { defineCollection, z } from 'astro:content';

const movies = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    difficulty: z.enum(['easy', 'normal', 'hard']),
    keywords: z.array(z.string()),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = {
  movies,
};
