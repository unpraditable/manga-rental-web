"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMangaList } from "@/lib/api/manga";
import { getMyRentals } from "@/lib/api/rental";
import { useAuthStore } from "@/store/authStore";
import MangaCard from "@/components/manga/MangaCard";
import { getRemainingDays } from "@/lib/utils/fine";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  const { data: mangaRes } = useQuery({
    queryKey: ["manga-list", {}],
    queryFn: () => getMangaList({ limit: 8 }),
  });

  const { data: rentals } = useQuery({
    queryKey: ["my-rentals", "active"],
    queryFn: () => getMyRentals("active"),
  });

  const nearestRental = rentals
    ?.filter((r) => r.status === "active" || r.status === "overdue")
    .sort(
      (a, b) => getRemainingDays(a.dueDate) - getRemainingDays(b.dueDate),
    )[0];

  const daysLeft = nearestRental
    ? getRemainingDays(nearestRental.dueDate)
    : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft <= 2;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Halo, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang di Manga Rental
        </p>
      </div>

      {/* Active rental banner */}
      {nearestRental && daysLeft !== null && (
        <Link href="/pinjaman">
          <div
            className={`rounded-2xl p-5 border transition hover:shadow-sm ${
              isOverdue
                ? "bg-red-50 border-red-200"
                : isUrgent
                  ? "bg-amber-50 border-amber-200"
                  : "bg-primary-50 border-primary-100"
            }`}
          >
            <p
              className={`text-xs font-medium mb-1 ${
                isOverdue
                  ? "text-red-600"
                  : isUrgent
                    ? "text-amber-600"
                    : "text-primary-600"
              }`}
            >
              {isOverdue ? "Denda berjalan!" : "Pinjaman aktif"}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {nearestRental.manga?.title} Vol.{" "}
              {nearestRental.volume?.volumeNumber}
            </p>
            <div className="mt-2.5 inline-flex">
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  isOverdue
                    ? "bg-red-100 text-red-700"
                    : isUrgent
                      ? "bg-amber-100 text-amber-700"
                      : "bg-primary-100 text-primary-700"
                }`}
              >
                {isOverdue
                  ? `Terlambat ${Math.abs(daysLeft)} hari`
                  : `Sisa ${daysLeft} hari`}
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Manga grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Manga populer
          </h2>
          <Link
            href="/katalog"
            className="text-sm text-primary-600 hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mangaRes?.data.map((manga, i) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
