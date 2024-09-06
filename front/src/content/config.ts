import { z, defineCollection } from 'astro:content';

const resumeCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        photo: z.string().optional(),
    }),
});


export const collections = {
    "about": resumeCollection,
};
