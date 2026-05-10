import { Rental } from "@/types/rental";
import { getRemainingDays } from "@/lib/utils/fine";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function RentalCard({ rental }: { rental: Rental }) {
  const daysLeft = getRemainingDays(rental.dueDate);
  const isOverdue = daysLeft < 0;
  const isUrgent = !isOverdue && daysLeft <= 2;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
      {/* Cover placeholder */}
      <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-md font-bold text-gray-600">
          {rental.manga?.title?.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-md font-semibold text-gray-900 truncate">
          {rental.manga?.title}
        </p>
        <p className="text-md text-gray-500">
          Vol. {rental.volume?.volumeNumber}
        </p>
        <p className="text-md text-gray-400 mt-1">
          Rented{" "}
          {format(parseISO(rental.rentDate), "d MMM yyyy", {
            locale: localeId,
          })}
        </p>
        <p className="text-md text-gray-400">
          Due{" "}
          {format(parseISO(rental.dueDate), "d MMM yyyy", { locale: localeId })}
        </p>
      </div>

      {/* Days badge */}
      <div className="flex-shrink-0 self-start">
        <span
          className={`text-md font-medium px-3 py-1 rounded-full ${
            isOverdue
              ? "bg-red-100 text-red-700"
              : isUrgent
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-50 text-gray-800"
          }`}
        >
          {isOverdue ? `+${Math.abs(daysLeft)}h` : `${daysLeft}h`}
        </span>
      </div>
    </div>
  );
}
