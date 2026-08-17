import "./globals.css";
import { CartProvider } from "../components/CartProvider";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "PhonePro — Buy, Sell & Trade-In Refurbished Phones",
  description:
    "Certified refurbished iPhone and Samsung Galaxy phones. Fully unlocked, tested and backed by a 24-month warranty. Buy, sell or trade in at PhonePro.",
  openGraph: {
    title: "PhonePro",
    description: "Buy · Sell · Trade-In. Certified refurbished phones with a 24-month warranty.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
