import { defineCollection, z } from 'astro:content';

const accordeonCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Define el esquema según tu estructura
  }),
});

const categoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Define el esquema según tu estructura
  }),
});

const gamesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Define el esquema según tu estructura
  }),
});

const footerCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Define el esquema según tu estructura
  }),
});

const homeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Define el esquema según tu estructura
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Define el esquema según tu estructura
  }),
});

export const collections = {
  accordeon: accordeonCollection,
  categories: categoriesCollection,
  games: gamesCollection,
  footer: footerCollection,
  home: homeCollection,
  services: servicesCollection,
};
