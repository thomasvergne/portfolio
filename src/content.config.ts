import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: "./src/content" }),
  schema: z.object({
    title: z.string().min(5).max(50),
    author: z.string(),
    relatedPosts: z.array(reference('blog')).default([]),
    description: z.string().min(10).max(140),
    date: z.coerce.date(),
    image: z.string().optional(),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: "./src/projects" }),
  schema: z.object({
    title: z.string().max(50),
    author: z.string(),
    description: z.array(z.string()),
    url: z.string().url()
  }),
});

export const collections = { blog, projects };