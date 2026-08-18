import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nududu by Dzie",
    short_name: "Nududu by Dzie",
    description: "Spicy Ghanaian home cooking, made to order for pickup or delivery.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF3E7",
    theme_color: "#C1502E",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
