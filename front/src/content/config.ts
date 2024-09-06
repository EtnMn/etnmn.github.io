import { z, defineCollection } from 'astro:content';

const resumeCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        photo: z.string().optional(),
    }),
});

const experienceCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        subTitle: z.string().optional(),
        caption: z.string().optional(),
        link: z.string().optional(),
    }),
});


export const collections = {
    "resume": resumeCollection,
    "experience": experienceCollection,
};
