import { useState } from "react";

interface Props {
  onSignIn: (email: string, password: string) => Promise<string | null>;
  onSignUp: (email: string, password: string) => Promise<string | null>;
}

export function LoginScreen({ onSignIn, onSignUp }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fn = mode === "signin" ? onSignIn : onSignUp;
    const err = await fn(email, password);

    setLoading(false);
    if (err) {
      setError(err);
    } else if (mode === "signup") {
      setSignedUp(true);
    }
  }

  if (signedUp) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm text-gray-500">
          A confirmation link was sent to <strong>{email}</strong>. Click it to activate your account, then come back and sign in.
        </p>
        <button
          onClick={() => { setMode("signin"); setSignedUp(false); }}
          className="mt-6 text-sm text-indigo-600 font-medium"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Habit Contract</h1>
          <p className="text-sm text-gray-500 mt-1">Apr 28 – Jul 31, 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50 active:bg-indigo-700 transition-colors"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
          className="mt-4 w-full text-center text-sm text-gray-500"
        >
          {mode === "signin" ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
