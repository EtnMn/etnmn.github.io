import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const educationCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/education" }),
    schema: z
        .object({
            end: z.coerce.date().optional(),
            link: z.string().optional(),
            location: z.string().optional(),
            start: z.coerce.date(),
            title: z.string().min(5).max(100),
        })
        .refine((data) => !data.end || data.start <= data.end, {
            message: "End date cannot be earlier than start date.",
            path: ["end"],
        }),
});

const experienceCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
    schema: z
        .object({
            end: z.coerce.date().optional(),
            link: z.string().optional(),
            start: z.coerce.date(),
            subTitle: z.string().max(100).optional(),
            title: z.string().min(5).max(100),
        })
        .refine((data) => !data.end || data.start <= data.end, {
            message: "End date cannot be earlier than start date.",
            path: ["end"],
        }),
});

const postsCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
    schema: z
        .object({
            edited: z.coerce.date().optional(),
            draft: z.coerce.boolean().default(false),
            published: z.coerce.date(),
            source: z.string().url().optional(),
            subTitle: z.string().max(300).optional(),
            tags: z.array(z.string().max(50)).default([]),
            title: z.string().min(5).max(100),
        })
        .refine((data) => !data.edited || data.published <= data.edited, {
            message: "Edited date cannot be earlier than published date.",
            path: ["edited"],
        }),
});

export const collections = {
    education: educationCollection,
    experience: experienceCollection,
    posts: postsCollection,
};
