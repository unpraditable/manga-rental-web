import { PriceList, Rental } from "@/types/rental";
import { apiClient } from "./client";

export const getPriceLists = async (): Promise<PriceList[]> => {
  const { data } = await apiClient.get("/price-lists");
  return data;
};

export const createRental = async (payload: {
  volumeId: string;
  priceListId: string;
}): Promise<Rental> => {
  const { data } = await apiClient.post("/rentals", payload);
  return data;
};

export const getMyRentals = async (status?: string): Promise<Rental[]> => {
  const { data } = await apiClient.get("/rentals/me", { params: { status } });
  return data;
};
