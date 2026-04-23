"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push("/beranda");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-7 h-7 bg-primary-100 rounded-lg" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Manga Rental</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun kamu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="email@kamu.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {mutation.isError && (
              <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100">
                Email atau password salah
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-800 text-primary-50 text-sm font-medium py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {mutation.isPending ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary-600 font-medium hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
