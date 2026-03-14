import "server-only";

import { createCallerFactory } from "@/lib/trpc/trpc";
import { appRouter } from "@/lib/trpc/routers/_app";

const createCaller = createCallerFactory(appRouter);

export const trpcServer = createCaller({});