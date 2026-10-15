import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InspiraArte",
    short_name: "inspiraarte",
    start_url: "/",
    scope: "/",
    display: "fullscreen",
    // Pantalla de arranque del color de fondo del sitio y barra del sistema del tono de la barra superior.
    background_color: "#fdfcf8",
    theme_color: "#faecdd",
    prefer_related_applications: true,
    icons: [
      {
        src: "/dam/logos/favicon-200.png",
        sizes: "200x200",
        type: "image/png",
      },
      {
        src: "/dam/logos/favicon.svg",
        sizes: "512x512",
        type: "image/svg",
      },
    ],
    id: "com.jojagawi.inspiraarte",
    description: "PWA App for InspiraArte",
    lang: "es",
    orientation: "natural",
    categories: [
      "design",
      "graphics &amp; design",
      "personalization",
      "shopping",
    ],
    shortcuts: [
      {
        name: "Productos",
        url: "/productos/",
        description:
          "Lista de productos que puedes solicitar dentro de InspiraArte",
      },
      {
        name: "Proceso",
        url: "/proceso/",
        description:
          "Analiza cual es el proceso que tenemos para fabricar nuestros productos",
      },
      {
        name: "FAQ",
        url: "/faq/",
        description: "Preguntas frecuentes dentro de InspiraArte",
      },
    ],
    launch_handler: {
      client_mode: "navigate-new",
    },
  };
}
