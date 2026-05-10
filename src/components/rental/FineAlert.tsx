import { Rental } from "@/types/rental";

interface Props {
  rental: Rental;
  fine: number;
}

export default function FineAlert({ rental, fine }: Props) {
  return (
    <div
      className="bg-red-50 rounded-xl p-4"
      style={{ borderLeft: "3px solid #E24B4A" }}
    >
      <p className="text-md font-semibold text-red-700">Your fine</p>
      <p className="text-sm text-red-600 mt-0.5">
        {rental.manga?.title} Vol. {rental.volume?.volumeNumber} — late
      </p>
      <p className="text-base font-bold text-red-700 mt-1">
        Rp {fine.toLocaleString("id")}
      </p>
      <p className="text-sm text-red-500 mt-0.5">
        Adding fine Rp{" "}
        {rental.priceList?.finePerDay.toLocaleString("id") ?? "0"}/day
      </p>
    </div>
  );
}
