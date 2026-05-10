"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMangaDetail } from "@/lib/api/manga";
import StatusBadge from "@/components/manga/StatusBadge";
import PriceListDialogue from "@/components/rental/PriceListDialogue";
import Image from "next/image";

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
    return <p className="text-gray-400 text-md">Manga tidak ditemukan</p>;

  const selectedVolume = manga.volumes.find((v) => v.id === selectedVolumeId);
  const availableVolumes = manga.volumes.filter(
    (v) => v.status === "available",
  );

  return (
    <div className="animate-fade-up space-y-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-md text-gray-600 hover:underline"
      >
        ← Back to Catalogue
      </button>

      {/* Hero section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cover placeholder */}
          <div className="w-32 h-44 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 self-start overflow-hidden">
            {manga.coverUrl ? (
              <Image
                src={manga.coverUrl}
                alt={`Cover ${manga.title}`}
                width={128}
                height={176}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-500">
                {manga.title.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {manga.title}
              </h1>
              <p className="text-md text-gray-500 mt-1">{manga.author}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm px-3 py-1 bg-gray-50 text-gray-800 rounded-full font-medium">
                {manga.genre}
              </span>
              <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                {manga.totalVolumes} volume
              </span>
              <span className="text-sm px-3 py-1 bg-accent-50 text-accent-600 rounded-full font-medium">
                {availableVolumes.length} tersedia
              </span>
            </div>
            <p className="text-md text-gray-600 leading-relaxed">
              {manga.description}
            </p>
          </div>
        </div>
      </div>

      {/* Volume picker */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-md font-semibold text-gray-900 mb-4">
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
                className={`px-3 py-2 rounded-xl border text-sm font-medium transition ${
                  isSel
                    ? "bg-gray-100 border-gray-400 text-gray-800"
                    : isAvail
                      ? "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
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
            className="px-6 py-2.5 bg-gray-600 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-gray-50 text-md font-medium rounded-xl transition"
          >
            {selectedVolumeId ? "Pilih durasi sewa" : "Pilih volume dulu"}
          </button>
          {selectedVolumeId && (
            <span className="text-sm text-gray-500">
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
            router.push("/rent");
          }}
        />
      )}
    </div>
  );
}
