import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Sign In Page</h1>
        <p className="text-lg mb-8">Please sign in to continue.</p>
      <SignIn />
        <p className="text-sm text-gray-500 mt-4">
            Don't have an account? <a href="/sign-up" className="text-blue-500">Sign Up</a>
        </p>
        </div>
        {/* <UserButton /> */}
        {/* <SignInButton /> */}
        {/* <SignUpButton /> */}
        {/* </SignedIn> */}
        
    </>
  );
}