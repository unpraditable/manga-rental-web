"use client";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Manga } from "@/types/manga";
import StatusBadge from "./StatusBadge";
import Image from "next/image";

interface Props {
  manga: Manga & { availableCount?: number; status?: string };
  style?: CSSProperties;
}

export default function MangaCard({ manga, style }: Props) {
  const initials = manga.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/catalogue/${manga.id}`}
      style={style}
      className="animate-fade-up block"
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition group cursor-pointer">
        {/* Cover */}
        <div className="w-full h-32 rounded-xl mb-3 overflow-hidden bg-gray-50 flex items-center justify-center">
          {manga.coverUrl ? (
            <Image
              src={manga.coverUrl}
              alt={`Cover ${manga.title}`}
              width={128}
              height={128}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <span className="text-xl font-bold text-gray-500">{initials}</span>
          )}
        </div>

        {/* Info */}
        <p className="text-md font-semibold text-gray-900 truncate">
          {manga.title}
        </p>
        <p className="text-md text-gray-500 mt-0.5 truncate">{manga.author}</p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-md text-gray-400">{manga.genre}</span>
          <StatusBadge
            status={(manga.availableCount ?? 0) > 0 ? "available" : "rented"}
            compact
          />
        </div>
      </div>
    </Link>
  );
}
