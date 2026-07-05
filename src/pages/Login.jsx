import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { CitrusMark } from '../components/Logo.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // signin | signup

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-6 text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-lime/20 blur-[120px] animate-glow" />

      <Link to="/" className="absolute left-6 top-6 flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <CitrusMark size={56} />
          <span className="mt-3 font-display text-3xl">Citrus</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
          <h1 className="font-display text-2xl">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-1 text-sm text-white/50">
            {mode === 'signin' ? 'Sign in to continue to Citrus.' : 'Start reading research smarter.'}
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-navy hover:brightness-95"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-white/30">
            <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
          </div>

          <label className="text-xs font-medium uppercase tracking-wide text-white/50">Email</label>
          <input
            type="email"
            placeholder="you@university.edu"
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-lime"
          />
          {mode === 'signup' && (
            <>
              <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-white/50">Display name</label>
              <input
                placeholder="Your name"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-lime"
              />
            </>
          )}
          <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-white/50">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-lime"
          />

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-medium text-navy hover:brightness-95"
          >
            <Mail size={16} /> {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-white/50">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="cursor-pointer font-medium text-lime hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
