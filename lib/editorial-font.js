import { IBM_Plex_Sans } from "next/font/google";

export const editorialDisplay = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-editorial-display",
  display: "swap",
});
