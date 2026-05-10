import { Manga, MangaDetail, MangaStatus, MangaVolume } from "@/types/manga";
import { apiClient } from "./client";

interface RawVolume {
  id: string;
  mangaId: string;
  volumeNumber: number;
  status: string; // "AVAILABLE" | "RENTED" | "DAMAGED"
  createdAt: string;
}

interface RawManga extends Omit<Manga, "volumes"> {
  volumes?: RawVolume[];
}

interface RawMangaListResponse {
  data: RawManga[];
  total: number;
  page: number;
  totalPages: number;
}

function normalizeVolume(v: RawVolume): MangaVolume {
  return {
    ...v,
    status: v.status.toLowerCase() as MangaStatus,
  };
}

export const getMangaList = async (params?: {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Manga[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const { data } = await apiClient.get<RawMangaListResponse>("/manga", {
    params,
  });

  return {
    ...data,
    data: data.data.map((m) => ({
      ...m,
      volumes: m.volumes?.map(normalizeVolume),
    })),
  };
};

export const getMangaDetail = async (id: string): Promise<MangaDetail> => {
  const { data } = await apiClient.get<RawManga & { volumes: RawVolume[] }>(
    `/manga/${id}`,
  );

  return {
    ...data,
    volumes: data.volumes.map(normalizeVolume),
  };
};
