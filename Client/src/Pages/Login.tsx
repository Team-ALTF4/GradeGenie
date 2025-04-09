import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../Components/Input";
import { Check, Info } from "lucide-react";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const effectRanRef = useRef(false);

  useEffect(() => {
    if (effectRanRef.current === false) {
      alert("Test UserName - thecurryguyy@gmail.com\nPassWord - 123456789");
      return () => {
        effectRanRef.current = true;
      };
    }
  }, []);

  async function login() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("https://grade-genie-server.vercel.app/api/v1/signin", {
        username: username,
        password: password,
      });
      alert("Login Successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert("Login Failed: Invalid credentials!");
      } else {
        alert("Login Failed: An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/30 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-purple-300/30 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-purple-400/20 blur-3xl"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold font-mono text-white mb-6">GradeGenie</h1>
              <p className="text-purple-100 text-xl mb-8">Welcome back to your academic command center.</p>
              <div className="space-y-6">
                {[
                  "Secure access to your dashboard",
                  "24/7 grade availability",
                  "Real-time academic insights"
                ].map((text, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-purple-400/30 p-2 rounded-full">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Info className="h-5 w-5 text-purple-200" />
                <span className="text-purple-100 text-sm">Trusted by educational institutions worldwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12">
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-bold font-mono text-purple-800">GradeGenie</h2>
            <p className="text-purple-600">Your academic companion</p>
          </div>

          <h3 className="text-3xl font-bold text-gray-800 mb-6">Welcome back!</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="space-y-5"
          >
            <Input label="Username" type="email" placeholder="you@example.com" inputRef={usernameRef} />
            <Input label="Password" type="password" placeholder="Enter password" inputRef={passwordRef} />

            <div className="pt-2">
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-75 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <div className="mx-4 text-sm text-gray-500">or</div>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <p className="mt-6 text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
