import { Manga, MangaDetail } from "@/types/manga";
import { apiClient } from "./client";

export const getMangaList = async (params?: {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Manga[]; total: number }> => {
  const { data } = await apiClient.get("/manga", { params });
  return data;
};

export const getMangaDetail = async (id: string): Promise<MangaDetail> => {
  const { data } = await apiClient.get(`/manga/${id}`);
  return data;
};
