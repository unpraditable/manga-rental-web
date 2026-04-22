import { Manga, MangaVolume } from "./manga";

export type RentalStatus = "active" | "returned" | "overdue";

export interface PriceList {
  id: string;
  durationDays: number;
  price: number;
  finePerDay: number;
  isActive: boolean;
}

export interface Rental {
  id: string;
  userId: string;
  volumeId: string;
  priceListId: string;
  rentDate: string;
  dueDate: string;
  returnDate: string | null;
  status: RentalStatus;
  fineAmount: number;
  manga?: Manga;
  volume?: MangaVolume;
  priceList?: PriceList;
}
