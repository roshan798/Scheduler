import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher([
    "/dashboard(.*)",
    "/events(.*)",
    "/meetings(.*)",
    "/availblity(.*)",
])
export default clerkMiddleware((auth, req) => {
    if (!auth().userId && isProtected(req)) {
        return auth().redirectToSignIn();
    }
});
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};