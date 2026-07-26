import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InspiraArte",
    short_name: "inspiraarte",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#000",
    icons: [
      {
        src: "/dam/logos/favicon-200.png",
        sizes: "200x200",
        type: "image/png",
      },
    ],
  };
}
