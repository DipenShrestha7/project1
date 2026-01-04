import "./index.css";
import { useState } from "react";
import mountainImage from "./assets/mountain.jpg";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isLogin ? "Logging in..." : "Creating account...");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="hidden md:block w-1/2 md:w-[50%] relative">
        <img
          src={mountainImage}
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-10">
          <h2 className="text-white text-4xl font-semibold leading-tight tracking-wide text-center">
            Explore places.
            <br />
            Create memories.
          </h2>
        </div>
      </div>

      <div className="hidden md:block absolute inset-y-0 left-[50%] w-40 pointer-events-none z-20">
        <div className="h-full w-full bg-linear-to-r from-black/20 via-black/5 to-transparent"></div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-[50%] relative flex items-center justify-center bg-[#f4f9ff] overflow-hidden">
        {/* Soft background layers */}
        <div className="absolute -top-32 -right-32 w-100 h-100 rounded-full bg-sky-200/40 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-100 h-100 rounded-full bg-blue-300/30 blur-3xl"></div>

        {/* Auth Card */}
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10">
          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-sky-600"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-sky-900 tracking-tight">
              {isLogin ? "Continue your journey" : "Start your journey"}
            </h1>
            <p className="text-sky-600 mt-2 text-sm">
              Discover places. Track memories.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition shadow-lg shadow-sky-600/30"
            >
              {isLogin ? "Log in" : "Create account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sky-600 mt-6 text-sm">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sky-700 font-medium hover:underline"
            >
              {isLogin ? "Create one" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
