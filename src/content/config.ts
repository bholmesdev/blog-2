import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z
      .string()
      .max(160, "For SEO juices, keep below 160 characters"),
    pubDate: z.string().transform((value) => new Date(value)),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
