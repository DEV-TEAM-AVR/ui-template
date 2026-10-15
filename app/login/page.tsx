"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { brand } from "@/app/config/brand";
import { Button } from "@/app/components/ui/Button";

/**
 * Full-screen dark login (always dark, regardless of theme): brand glow, logo tile, two fields,
 * inline error, lg primary button, "developed by" footer. Auth pages are the one place the
 * inputs are hand-styled (dark-on-dark), so don't copy these classes into in-app forms.
 */
const GENERIC_LOGIN_ERROR = "No pudimos iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.";
const GENERIC_CONNECTION_ERROR = "No pudimos conectarnos al servidor. Inténtalo nuevamente en unos minutos.";

const authInputCls =
  "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 group-hover:border-zinc-700";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  React.useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      // Never echo the server's message: one generic text for bad credentials, one for the rest.
      setError([400, 401, 403].includes(err?.status) ? GENERIC_LOGIN_ERROR : GENERIC_CONNECTION_ERROR);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-950 text-white overflow-hidden selection:bg-brand-500/30">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full max-w-[400px]">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-4 bg-brand-500/10 rounded-2xl border border-brand-500/20 mb-6 shadow-xl shadow-brand-500/5">
              <Image src={brand.logo} alt={`${brand.name} Logo`} width={64} height={64} className="rounded-lg" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{brand.welcome}</h1>
            <p className="text-zinc-400 text-sm">{brand.tagline}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Correo Electrónico o Usuario</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  placeholder="ej. usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputCls}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Contraseña</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${authInputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-lg flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <Button variant="primary" size="lg" fullWidth type="submit" loading={loading}>
              Entrar al Sistema
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </form>

          {brand.developedBy && (
            <div className="mt-12 pt-6 border-t border-zinc-900 text-center">
              <p className="text-3xs text-zinc-600 font-medium uppercase tracking-widest">Desarrollado por:</p>
              <p className="text-sm text-zinc-500 font-semibold mt-1">{brand.developedBy}</p>
              <div className="mt-6 flex flex-col gap-1 items-center">
                {brand.company && <p className="text-3xs text-zinc-600">{brand.company}</p>}
                <p className="text-3xs text-zinc-500 font-bold tracking-widest uppercase">
                  {brand.name} • v{process.env.NEXT_PUBLIC_APP_VERSION}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
