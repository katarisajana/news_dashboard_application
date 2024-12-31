"use client"
import { useState } from "react";
import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session || localStorage.getItem("isAuthenticated") === "True") {
      // If session exists (user is logged in), redirect to dashboard
      router.push("/");
    }
  }, [session, router]);

  // State for email and password login
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle email/password login
  const handleLogin = () => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (email === storedEmail && password === storedPassword) {
      localStorage.setItem("isAuthenticated", "True");
      alert("Login successful!");
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
        localStorage.setItem("isAdmin", "True")
      router.push("/");
    } else {
      alert("Invalid credentials!");
    }
  };

  // Handle email/password signup
  const handleSignup = () => {
    if (email.length!=0 && password.length!=0) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      alert("Signup successful! You can now log in.");
      setEmail("");
      setPassword("");
    }
    else
    {
      alert("Email and password should not be empty.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "False");
    setEmail("");
    setPassword("");
    router.push("/login");
  };

  return (
    <div className="p-7">
      {(session || (localStorage.getItem("isAuthenticated")=="True")) ? (
        <div className="flex items-center justify-between">
        <div className="flex items-center">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="User Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
          )}
          <p className="text-lg font-semibold">
            Welcome, {session?.user?.name || email || "User"}!
          </p>
        </div>
        <button
          onClick={() => {
            if (session) {
              signOut();
            } else {
              handleLogout();
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          {session ? "Sign Out" : "Logout"}
        </button>
      </div>
      ) : (
        <div className="flex flex-col items-center py-40 min-h-screen bg-gray-100 w-full border">
          <p className="mb-8 text-2xl font-bold">Login to continue.</p>

          {/* Email/Password Login Form */}
          <div className="flex flex-col gap-5 mb-4 w-full max-w-sm">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div className="flex gap-6">
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Signup
            </button>
          </div>

          {/* Google OAuth Login */}
          <p className="mt-6 text-sm text-gray-500">Or:</p>
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;

