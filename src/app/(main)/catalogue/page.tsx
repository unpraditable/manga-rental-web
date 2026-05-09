"use client";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMangaList } from "@/lib/api/manga";
import MangaCard from "@/components/manga/MangaCard";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Romance",
  "Horror",
  "Comedy",
  "Sports",
  "Slice of Life",
];

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  const handleSearch = (v: string) => {
    setSearch(v);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(v);
    }, 400);
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      "manga-list",
      { search: debouncedSearch, genre: genre === "All" ? undefined : genre },
    ],
    queryFn: () =>
      getMangaList({
        search: debouncedSearch,
        genre: genre === "All" ? undefined : genre,
      }),
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Catalogue</h1>
        <p className="text-sm text-gray-500 mt-1">Find your favorite manga</p>
      </div>

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
                genre === g
                  ? "bg-primary-600 text-primary-50 border-primary-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400">
            {data?.total ?? 0} title found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.data.map((manga, i) => (
              <MangaCard
                key={manga.id}
                manga={manga}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          {data?.data.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No manga found
            </div>
          )}
        </>
      )}
    </div>
  );
}
