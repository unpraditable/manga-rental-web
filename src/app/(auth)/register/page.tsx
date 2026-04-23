"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register as registerApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

const schema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(10, "Nomor HP tidak valid"),
    password: z.string().min(6, "Minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });
type Form = z.infer<typeof schema>;

export default function RegisterPage() {
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
    mutationFn: (v: Form) =>
      registerApi({
        name: v.name,
        email: v.email,
        phone: v.phone,
        password: v.password,
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push("/beranda");
    },
  });

  const fields: {
    name: keyof Form;
    label: string;
    type: string;
    placeholder: string;
  }[] = [
    {
      name: "name",
      label: "Nama lengkap",
      type: "text",
      placeholder: "Budi Santoso",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email@kamu.com",
    },
    {
      name: "phone",
      label: "Nomor HP",
      type: "tel",
      placeholder: "08xxxxxxxxxx",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
    {
      name: "confirmPassword",
      label: "Ulangi password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-7 h-7 bg-primary-100 rounded-lg" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Buat akun</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar untuk mulai menyewa manga
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm text-gray-600 mb-1.5">
                  {label}
                </label>
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-800 text-primary-50 text-sm font-medium py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {mutation.isPending ? "Memproses..." : "Daftar sekarang"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary-600 font-medium hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
