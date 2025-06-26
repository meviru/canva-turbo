import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    afterSignOut: "/handler/sign-in",
    afterSignIn: "/workspace",
    afterSignUp: "/workspace",
  }
});
