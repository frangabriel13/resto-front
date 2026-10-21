import * as Sentry from "@sentry/nextjs";
import { sentryEnv, sentryOptions } from "@/lib/sentry/options";

const options = sentryOptions(sentryEnv());
if (options) Sentry.init(options);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
