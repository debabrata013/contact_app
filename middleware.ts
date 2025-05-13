import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes ko define karo - sign in aur sign up ke liye
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

// Protected routes ko define karo - dashboard aur admin ke liye
const isProtectedRoute = createRouteMatcher(['/home(.*)', '/admin(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  // Protected routes ke liye authentication check
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  // Public routes ke liye koi authentication nahi chahiye
  if (isPublicRoute(req)) {
    return // public routes freely accessible
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}