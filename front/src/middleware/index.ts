import { defineMiddleware } from "astro:middleware";
import config from "@/config.json";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
    if (!config?.blog?.enabled && context.url.pathname.startsWith("/blog")) {
        return context.rewrite(
            new Request(new URL("/404", context.url), {
                headers: {
                    "x-redirect-to": context.url.pathname,
                },
            })
        );
    }

    return next();
});
