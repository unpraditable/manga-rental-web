"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { formatDistanceToNow, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Notification {
  id: string;
  type: "due_soon" | "overdue" | "rental_confirmed" | "info";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const typeStyle: Record<Notification["type"], { dot: string; bg: string }> = {
  overdue: { dot: "bg-red-400", bg: "bg-red-50" },
  due_soon: { dot: "bg-amber-400", bg: "bg-amber-50" },
  rental_confirmed: { dot: "bg-green-400", bg: "bg-green-50" },
  info: { dot: "bg-gray-300", bg: "" },
};

export default function NotificationPage() {
  const { data: notifs, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await apiClient.get("/notifications");
      return data;
    },
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <h1 className="text-2xl font-semibold text-gray-900">Notifikasi</h1>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : notifs?.length === 0 ? (
        <p className="text-gray-400 text-md text-center py-12">
          Belum ada notifikasi
        </p>
      ) : (
        <div className="space-y-2">
          {notifs?.map((n) => {
            const s = typeStyle[n.type];
            return (
              <div
                key={n.id}
                className={`flex gap-3 p-4 rounded-xl border ${
                  n.read
                    ? "bg-white border-gray-100"
                    : `${s.bg} border-transparent`
                }`}
              >
                <div
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-md font-medium text-gray-900">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatDistanceToNow(parseISO(n.createdAt), {
                      addSuffix: true,
                      locale: localeId,
                    })}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
