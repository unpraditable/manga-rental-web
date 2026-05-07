"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api/client";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
});
type Form = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  const mutation = useMutation({
    mutationFn: async (v: Form) => {
      const { data } = await apiClient.patch("/users/me", v);
      return data;
    },
    onSuccess: (data) => {
      const token = document.cookie.match(/access_token=([^;]+)/)?.[1] ?? "";
      setAuth(data, token);
    },
  });

  return (
    <div className="space-y-6 animate-fade-up max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary-600">
            {user?.name?.[0]}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Edit profil</h2>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Nama lengkap
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Email</label>
            <input
              value={user?.email ?? ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Nomor HP
            </label>
            <input
              {...register("phone")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {mutation.isSuccess && (
            <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg border border-green-100">
              Profil berhasil diperbarui
            </div>
          )}

          <button
            type="submit"
            disabled={!isDirty || mutation.isPending}
            className="w-full bg-primary-600 hover:bg-primary-800 disabled:bg-gray-100 disabled:text-gray-400 text-primary-50 text-sm font-medium py-2.5 rounded-xl transition"
          >
            {mutation.isPending ? "Saving..." : "Saving changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
