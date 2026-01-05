import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mountainImage from "../assets/mountain.jpg";

type User = {
  fullName?: string;
  email?: string;
  password?: string;
};

const App = () => {
  const [, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const url = isLogin
      ? "http://localhost:9000/api/login"
      : "http://localhost:9000/api/signup";

    const body = isLogin
      ? { email, password }
      : { user_name: fullName, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }
      if (isLogin) {
        alert("Logged in successfully");
        navigate("/dashboard");
      } else {
        setUser(body);
        alert("Account created successfully. Redirecting to login page...");
        setIsLogin(true); // switch back to login
        setPassword("");
        setConfirmPassword("");
      }
      console.log("Success:", data);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src={mountainImage}
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center px-10">
          <h2 className="text-white text-4xl font-semibold text-center">
            Explore places.
            <br />
            Create memories.
          </h2>
        </div>
      </div>

      <div className="hidden md:block absolute inset-y-0 left-[50%] w-40 pointer-events-none z-20">
        <div className="h-full w-full bg-linear-to-r from-black/20 via-black/5 to-transparent" />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f4f9ff] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-100 h-100 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-100 h-100 rounded-full bg-blue-300/30 blur-3xl" />

        <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-600 rounded-t-3xl" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-sky-900">
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/40 focus:ring-2 focus:ring-sky-500"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/40 focus:ring-2 focus:ring-sky-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
            >
              {isLogin ? "Log in" : "Create account"}
            </button>
          </form>

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
