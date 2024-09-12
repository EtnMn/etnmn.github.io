import { z, defineCollection } from "astro:content";

const experienceCollection = defineCollection({
    type: "content",
    schema: z
        .object({
            title: z.string().min(5).max(100),
            subTitle: z.string().max(100).optional(),
            start: z.coerce.date(),
            end: z.coerce.date().optional(),
            link: z.string().optional(),
        })
        .refine((data) => !data.end || data.start <= data.end, {
            message: "End date cannot be earlier than start date.",
            path: ["end"],
        }),
});

const educationCollection = defineCollection({
    type: "content",
    schema: z
        .object({
            location: z.string().optional(),
            title: z.string().min(5).max(100),
            start: z.coerce.date(),
            end: z.coerce.date().optional(),
            link: z.string().optional(),
        })
        .refine((data) => !data.end || data.start <= data.end, {
            message: "End date cannot be earlier than start date.",
            path: ["end"],
        }),
});

const postsCollection = defineCollection({
    type: "content",
    schema: z
        .object({
            title: z.string().min(5).max(100),
            subTitle: z.string().max(300).optional(),
            published: z.coerce.date(),
            edited: z.coerce.date().optional(),
            tags: z.array(z.string().max(50)).default([]),
        })
        .refine((data) => !data.edited || data.published <= data.edited, {
            message: "Edited date cannot be earlier than published date.",
            path: ["edited"],
        }),
});

export const collections = {
    experience: experienceCollection,
    education: educationCollection,
    posts: postsCollection,
};
