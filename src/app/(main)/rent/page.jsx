"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyRentals } from "@/lib/api/rental";
import { calculateFine } from "@/lib/utils/fine";
import RentalCard from "@/components/rental/RentalCard";
import FineAlert from "@/components/rental/FineAlert";

export default function RentPage() {
  const { data: rentals, isLoading } = useQuery({
    queryKey: ["my-rentals"],
    queryFn: () => getMyRentals(),
  });

  const activeRentals =
    rentals?.filter((r) => r.status === "active" || r.status === "overdue") ??
    [];
  const overdueRentals = activeRentals.filter((r) => r.status === "overdue");

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My rent</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeRentals.length} active rents
          </p>
        </div>
        <Link
          href="/rent/history"
          className="text-sm text-primary-600 hover:underline"
        >
          Browse history →
        </Link>
      </div>

      {/* Fine alerts */}
      {overdueRentals.map((r) => (
        <FineAlert
          key={r.id}
          rental={r}
          fine={calculateFine(r.dueDate, r.priceList?.finePerDay ?? 0)}
        />
      ))}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : activeRentals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">No active rents</p>
          <Link
            href="/catalogue"
            className="text-primary-600 text-sm font-medium hover:underline"
          >
            Browse catalogue →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activeRentals.map((r) => (
            <RentalCard key={r.id} rental={r} />
          ))}
        </div>
      )}
    </div>
  );
}
