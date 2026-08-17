import { Suspense } from "react";
import ShopBrowser from "../../components/ShopBrowser";

export const metadata = {
  title: "Shop all phones — PhonePro",
  description: "Browse certified refurbished iPhone and Samsung Galaxy phones. Filter by brand, condition and price.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-ink-soft">Loading shop…</div>}>
      <ShopBrowser />
    </Suspense>
  );
}
