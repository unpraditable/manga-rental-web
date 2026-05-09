"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyRentals } from "@/lib/api/rental";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function RentHistoryPage() {
  const { data: rentals, isLoading } = useQuery({
    queryKey: ["my-rentals", "returned"],
    queryFn: () => getMyRentals("returned"),
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <Link href="/rent" className="text-sm text-primary-600 hover:underline">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">
          Rent history
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : rentals?.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">
          No active rents
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Manga
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                  Rented
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                  Returned
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                  Fine
                </th>
              </tr>
            </thead>
            <tbody>
              {rentals?.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {r.manga?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Vol. {r.volume?.volumeNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {format(parseISO(r.rentDate), "d MMM yyyy", {
                      locale: localeId,
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {r.returnDate
                      ? format(parseISO(r.returnDate), "d MMM yyyy", {
                          locale: localeId,
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.fineAmount > 0 ? (
                      <span className="text-red-600 font-medium">
                        Rp {r.fineAmount.toLocaleString("id")}
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs">Nothing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
