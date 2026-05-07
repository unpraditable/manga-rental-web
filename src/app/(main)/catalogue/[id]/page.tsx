"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMangaDetail } from "@/lib/api/manga";
import StatusBadge from "@/components/manga/StatusBadge";
import PriceListDialogue from "@/components/rental/PriceListDialogue";

export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const { data: manga, isLoading } = useQuery({
    queryKey: ["manga-detail", id],
    queryFn: () => getMangaDetail(id),
  });

  if (isLoading)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );

  if (!manga)
    return <p className="text-gray-400 text-sm">Manga tidak ditemukan</p>;

  const selectedVolume = manga.volumes.find((v) => v.id === selectedVolumeId);
  const availableVolumes = manga.volumes.filter(
    (v) => v.status === "available",
  );

  return (
    <div className="animate-fade-up space-y-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-primary-600 hover:underline"
      >
        ← Kembali ke katalog
      </button>

      {/* Hero section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cover placeholder */}
          <div className="w-32 h-44 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 self-start">
            <span className="text-2xl font-bold text-primary-600">
              {manga.title.slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {manga.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{manga.author}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
                {manga.genre}
              </span>
              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                {manga.totalVolumes} volume
              </span>
              <span className="text-xs px-3 py-1 bg-accent-50 text-accent-600 rounded-full font-medium">
                {availableVolumes.length} tersedia
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {manga.description}
            </p>
          </div>
        </div>
      </div>

      {/* Volume picker */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Pilih volume
        </h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {manga.volumes.map((vol) => {
            const isAvail = vol.status === "available";
            const isSel = vol.id === selectedVolumeId;
            return (
              <button
                key={vol.id}
                disabled={!isAvail}
                onClick={() => setSelectedVolumeId(isSel ? null : vol.id)}
                className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${
                  isSel
                    ? "bg-primary-100 border-primary-400 text-primary-800"
                    : isAvail
                      ? "bg-white border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                      : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <div>Vol {vol.volumeNumber}</div>
                <StatusBadge status={vol.status} className="mt-1" />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={!selectedVolumeId}
            onClick={() => setShowDialog(true)}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-800 disabled:bg-gray-100 disabled:text-gray-400 text-primary-50 text-sm font-medium rounded-xl transition"
          >
            {selectedVolumeId ? "Pilih durasi sewa" : "Pilih volume dulu"}
          </button>
          {selectedVolumeId && (
            <span className="text-xs text-gray-500">
              Volume{" "}
              {
                manga.volumes.find((v) => v.id === selectedVolumeId)
                  ?.volumeNumber
              }{" "}
              dipilih
            </span>
          )}
        </div>
      </div>

      {/* Dialog */}
      {selectedVolume && (
        <PriceListDialogue
          open={showDialog}
          manga={manga}
          volume={selectedVolume}
          onClose={() => setShowDialog(false)}
          onSuccess={() => {
            setShowDialog(false);
            router.push("/pinjaman");
          }}
        />
      )}
    </div>
  );
}
