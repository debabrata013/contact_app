import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <>
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Sign Up Page</h1>
      <p className="text-lg mb-8">Please sign up to continue.</p>
      <SignUp />
      <p className="text-sm text-gray-500 mt-4">
          Don't have an account? <a href="/sign-in" className="text-blue-500">Sign In</a>
      </p>
    </div>
  </>
}