export type MangaStatus = "available" | "rented" | "damaged";

export interface Manga {
  id: string;
  title: string;
  author: string;
  genre: string;
  totalVolumes: number;
  coverUrl: string;
  description: string;
  createdAt: string;
}

export interface MangaVolume {
  id: string;
  mangaId: string;
  volumeNumber: number;
  status: MangaStatus;
}

export interface MangaDetail extends Manga {
  volumes: MangaVolume[];
}
