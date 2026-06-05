import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c - 1), 1000);
    const timeout = setTimeout(() => navigate("/", { replace: true }), 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold mb-3">Page not found</h1>
        <p className="mb-4">The route you requested does not exist.</p>
        <p className="mb-6">
          Redirecting to the home page in {count} second{count === 1 ? "" : "s"}
          .
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Home Now
          </Link>
        </div>
      </div>
    </div>
  );
}
