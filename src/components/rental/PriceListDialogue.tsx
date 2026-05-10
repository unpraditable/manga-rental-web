"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPriceLists, createRental } from "@/lib/api/rental";
import { format, addDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MangaDetail, MangaVolume } from "@/types/manga";

interface Props {
  open: boolean;
  manga: MangaDetail;
  volume: MangaVolume;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PriceListDialogue({
  open,
  manga,
  volume,
  onClose,
  onSuccess,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: priceLists } = useQuery({
    queryKey: ["price-lists"],
    queryFn: getPriceLists,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: createRental,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
      onSuccess();
    },
  });

  const selected = priceLists?.find((p) => p.id === selectedId);

  if (!open) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Sheet */}
      <div className="w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-3xl p-6 animate-fade-up max-h-[85vh] overflow-y-auto">
        {/* Handle (mobile) */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="mb-5">
          <p className="text-md text-gray-500">Pilih durasi sewa</p>
          <p className="text-base font-semibold text-gray-900">
            {manga.title} Vol. {volume.volumeNumber}
          </p>
        </div>

        {/* Price options */}
        <p className="text-md font-medium text-gray-400 uppercase tracking-wider mb-3">
          Paket durasi
        </p>
        <div className="space-y-2 mb-5">
          {priceLists?.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full flex justify-between items-center p-3.5 rounded-xl border text-left transition ${
                selectedId === p.id
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div>
                <p className="text-md font-medium text-gray-900">
                  {p.durationDays} days
                </p>
                <p className="text-md text-gray-500 mt-0.5">
                  Fine Rp {p.finePerDay.toLocaleString("id")}/days
                </p>
              </div>
              <p
                className={`text-md font-semibold ${selectedId === p.id ? "text-gray-800" : "text-gray-900"}`}
              >
                Rp {p.price.toLocaleString("id")}
              </p>
            </button>
          ))}
        </div>

        {/* Summary */}
        {selected && (
          <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100 space-y-2">
            <div className="flex justify-between text-md">
              <span className="text-gray-500">Duration</span>
              <span className="text-gray-700">
                {selected.durationDays} days
              </span>
            </div>
            <div className="flex justify-between text-md">
              <span className="text-gray-500">Due</span>
              <span className="text-gray-700">
                {format(
                  addDays(new Date(), selected.durationDays),
                  "d MMMM yyyy",
                  { locale: localeId },
                )}
              </span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between text-md font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                Rp {selected.price.toLocaleString("id")}
              </span>
            </div>
          </div>
        )}

        {mutation.isError && (
          <p className="text-red-500 text-md mb-3">
            Terjadi kesalahan. Coba lagi.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-md text-gray-600 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            disabled={!selectedId || mutation.isPending}
            onClick={() => {
              if (!selectedId) return;
              mutation.mutate({ volumeId: volume.id, priceListId: selectedId });
            }}
            className="flex-1 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-gray-50 text-md font-medium transition"
          >
            {mutation.isPending ? "Memproses..." : "Konfirmasi sewa"}
          </button>
        </div>
      </div>
    </div>
  );
}
