import { MetadataRoute } from "next";
import { EU_CODES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";
  const items: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/countries`, priority: 0.8 },
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/privacy`, priority: 0.5 },
    { url: `${base}/contact`, priority: 0.5 },
  ];
  EU_CODES.forEach(code=> items.push({ url: `${base}/country/${code}`, priority: 0.7 }));
  return items;
}
