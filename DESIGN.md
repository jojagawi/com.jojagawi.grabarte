---
name: InspiraArte
description: Personalización sin límites, del diseño a la realidad.
colors:
  petroleum-blue: "#367A8A"
  petroleum-deep: "#2F6E7D"
  spark-teal: "#1FA4A7"
  bright-cyan: "oklch(80% 0.15 210deg)"
  workshop-green: "#00B003"
  creative-purple: "oklch(50% 0.18 280deg)"
  olive-wood: "#585106"
  warm-paper: "oklch(99% 0.005 90deg)"
  pure-white: "oklch(100% 0 0deg)"
  charcoal-ink: "oklch(20% 0.01 240deg)"
  mist: "oklch(95% 0.01 240deg)"
  slate-muted: "oklch(50% 0.02 240deg)"
  hairline: "oklch(90% 0.01 240deg)"
  alert-red: "oklch(57.7% 0.245 27.325deg)"
typography:
  display:
    fontFamily: "Playfair Display, Playfair Display Fallback, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Playfair Display, Playfair Display Fallback, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Playfair Display, Playfair Display Fallback, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, DM Sans Fallback, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "DM Sans, DM Sans Fallback, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "DM Sans, DM Sans Fallback, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.petroleum-blue}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.petroleum-deep}"
  button-outline:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.petroleum-blue}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  eyebrow-pill:
    backgroundColor: "#367A8A1A"
    textColor: "{colors.petroleum-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 16px"
  personalizable-tag:
    backgroundColor: "{colors.creative-purple}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  meta-chip:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  product-card:
    backgroundColor: "{colors.pure-white}"
    rounded: "{rounded.xl}"
  input:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
---

# Design System: InspiraArte

## Overview

**Creative North Star: "La vitrina de regalos"**

InspiraArte se ve como una tienda de regalos bien cuidada: fondo blanco cálido como madera clara, mucho aire alrededor de cada pieza y el producto real siempre al frente. La vitrina es festiva sin ser ruidosa: el color aparece para señalar dónde actuar o qué es especial, nunca para decorar. Los títulos en Playfair Display dan el tono de regalo y ocasión; el texto en DM Sans mantiene la información clara y práctica.

La densidad es generosa en las páginas públicas (secciones de 96px de alto, rejillas con 24px entre tarjetas) y más compacta en filtros y herramientas internas. Las superficies descansan planas y responden al tacto: una tarjeta de producto se levanta cuando el visitante muestra interés.

**Key Characteristics:**
- Blanco cálido de fondo, tarjetas blanco puro; el contraste lo da la pieza, no el marco.
- Un solo color de acción (azul petróleo) que se profundiza como respuesta al hover.
- Títulos serif con peso, texto sans tranquilo.
- Etiquetas en forma de píldora para presentar cada sección.
- Planas en reposo, elevadas al interactuar.

## Colors

Una base neutra y cálida, un azul petróleo para todo lo accionable y acentos puntuales con significado propio.

### Primary
- **Azul Petróleo** (petroleum-blue): el color de acción. Botones principales, enlaces, íconos activos, texto de las píldoras de sección y anillos de enfoque de las tarjetas. Es el token `--primary`. Se oscureció desde `#4290A3` para cumplir WCAG AA: 4.88:1 con texto blanco y 4.75:1 como texto sobre Papel Cálido.
- **Petróleo Profundo** (petroleum-deep): estado hover y activo de todo lo que usa Azul Petróleo (5.76:1 con blanco).
- **Teal Chispa** (spark-teal): el teal brillante del logo. Solo decorativo: cifras destacadas y tintes de marca. No se usa para texto pequeño ni como estado de un control (3.03:1 con blanco).

### Secondary
- **Verde Taller** (workshop-green): acento de contacto y éxito. Íconos de medios de contacto, confirmaciones (diseño guardado) y tintes suaves al 10–15% en encabezados de categoría.
- **Púrpura Creativo** (creative-purple): **reservado para "Personalizable"**. Marca qué se puede personalizar en un producto (nombre, logo, tamaño, material): la etiqueta "Personalizable" y los detalles que la acompañan.

### Tertiary
- **Cian Brillante** (bright-cyan): anillos de enfoque del sistema (`--ring`) y fondo de hover en botones fantasma y de contorno.
- **Olivo Madera** (olive-wood): tinte ocasional de píldoras y cifras en secciones informativas (proceso, testimonios, FAQ). Uso puntual; no es un color de acción.

### Neutral
- **Papel Cálido** (warm-paper): fondo de página y de campos de formulario.
- **Blanco Puro** (pure-white): tarjetas, popovers y el panel de filtros; se separa del fondo por el borde, no por color.
- **Tinta Carbón** (charcoal-ink): texto principal y títulos.
- **Niebla** (mist): fondos secundarios y chips de metadatos (material, categoría).
- **Pizarra** (slate-muted): texto secundario, descripciones y navegación en reposo.
- **Línea Fina** (hairline): todos los bordes y divisores.
- **Rojo Alerta** (alert-red): solo errores y acciones destructivas.

### Named Rules
**The One Action Rule.** Todo lo que se puede pulsar para avanzar es Azul Petróleo; ningún otro color compite con él por la atención del clic.

**The Purple Means Personal Rule.** El Púrpura Creativo solo aparece donde el cliente puede personalizar algo. Si no se puede personalizar, no es púrpura.

**The Token Debt Rule.** Los hex escritos en componentes (`#00B003`, `#585106`, `#3ACBFE`) son deuda: el trabajo nuevo usa los tokens y, al tocar un archivo, se migra.

## Typography

**Display Font:** Playfair Display (con Georgia y serif)
**Body Font:** DM Sans (con system-ui y sans-serif)

**Character:** Playfair Display aporta el tono de regalo y de ocasión especial; DM Sans, geométrica y amable, deja precios, tiempos y descripciones claros a primera vista.

### Hierarchy
- **Display** (700, de 2.25rem a 3.75rem según el ancho, interlineado 1.25): titular del hero; uno por página. `text-wrap: balance`.
- **Headline** (700, de 1.875rem a 3rem, interlineado 1.2): títulos de sección ("Nuestro catálogo", "Cómo trabajamos").
- **Title** (700, 1.5rem): títulos de bloques internos y nombres de producto en la ficha.
- **Body Lead** (400, 1.125rem, interlineado 1.625): párrafo introductorio bajo un título, máximo ~36rem (`max-w-xl`).
- **Body** (400, 1rem, interlineado 1.6): texto corrido y descripciones.
- **Label** (500, 0.875rem): navegación, botones, píldoras de sección y etiquetas de formulario.

### Named Rules
**The Serif Is For Headings Rule.** Playfair Display solo en títulos (display, headline, title). Precios, botones, etiquetas y texto corrido siempre en DM Sans.

## Layout

Contenedor centrado de 1280px como máximo (`max-w-7xl`) con márgenes laterales de 16px en móvil, 24px en tablet y 32px en escritorio. El texto largo se limita a 896px (`max-w-4xl`) o 768px (`max-w-3xl`).

Las secciones públicas tienen 96px de relleno vertical (64–80px en secciones secundarias). El encabezado es fijo, de 64px de alto, y el contenido compensa con 64px de margen superior.

La rejilla del catálogo pasa de 1 columna a 2 (≥768px) y a 4 (≥1024px), con 24px entre tarjetas. El hero usa dos columnas desde 1024px (texto e imagen) con 48px entre ellas. Los filtros del catálogo van en una rejilla de hasta 6 columnas dentro de un panel blanco.

## Elevation & Depth

Planas en reposo, elevadas al interactuar. Las tarjetas y paneles se separan del fondo con un borde fino (Línea Fina) y blanco puro, no con sombra. La sombra aparece como respuesta: una tarjeta de producto al pasar el cursor gana una sombra amplia teñida de azul petróleo y sube 4px. Los botones de contorno tienen una sombra mínima (`shadow-xs`); las tarjetas genéricas, una muy suave (`shadow-sm`).

### Shadow Vocabulary
- **Reposo de tarjeta** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): tarjetas genéricas en reposo.
- **Elevación de vitrina** (`box-shadow: 0 20px 25px -5px rgb(54 122 138 / 0.10), 0 8px 10px -6px rgb(54 122 138 / 0.10)`): tarjeta de producto en hover, junto con `translateY(-4px)`.

### Named Rules
**The Lift On Interest Rule.** Toda tarjeta clicable descansa plana con borde y se eleva (sombra teñida + 4px hacia arriba, 300ms) en hover y enfoque. Las superficies no clicables nunca se elevan.

## Shapes

Esquinas suaves y amables. El radio base es de 12px; los controles (botones, campos, chips) usan 8–10px, las tarjetas y paneles grandes 16px, y las etiquetas de presentación son píldoras completas. Las imágenes de producto se recortan dentro de la tarjeta sin borde propio. No hay esquinas rectas en la interfaz pública.

## Components

### Buttons
Directos y claros.
- **Shape:** esquinas suaves (10px), alto de 36px (40px en tamaño grande).
- **Primary:** fondo Azul Petróleo, texto blanco, 16px de relleno horizontal, DM Sans 500 a 0.875rem.
- **Hover / Focus:** el fondo pasa a Petróleo Profundo; el enfoque muestra un anillo de 3px en Cian Brillante al 50%. Una flecha al final se desplaza 4px a la derecha en hover.
- **Outline:** borde y texto Azul Petróleo sobre Papel Cálido; en hover, fondo Azul Petróleo al 10%.
- **Ghost / Link:** sin fondo; el enlace es Azul Petróleo con subrayado en hover.

### Eyebrow Pill (signature)
Presenta cada sección por encima de su título: píldora completa con fondo del color de acento al 10% y texto del mismo color, DM Sans 500 a 0.875rem, 16px × 4px de relleno. Azul Petróleo por defecto; Verde Taller en contacto y éxito; Olivo Madera en secciones informativas.

### Chips
- **Meta chip:** fondo Niebla, texto Pizarra, 0.75rem, esquinas de 8px. Muestra material y categoría en las tarjetas.
- **Personalizable:** fondo Púrpura Creativo, texto blanco, esquinas de 8px. Solo en productos personalizables.

### Cards / Containers
- **Corner Style:** 16px en tarjetas de producto y paneles; 12px en tarjetas genéricas.
- **Background:** Blanco Puro sobre Papel Cálido.
- **Shadow Strategy:** ver "The Lift On Interest Rule".
- **Border:** Línea Fina de 1px.
- **Internal Padding:** 16px en paneles de filtro; 24px en tarjetas genéricas.
- **Product card:** imagen arriba que crece al 105% en hover (500ms), seguida de nombre, chips y precio.

### Inputs / Fields
- **Style:** borde Línea Fina de 1px, fondo Papel Cálido, esquinas de 10px, 40px de alto, 12px de relleno horizontal, texto a 0.875rem.
- **Focus:** borde en Cian Brillante con anillo de 3px al 50%.
- **Error / Disabled:** borde Rojo Alerta con anillo al 20%; deshabilitado al 50% de opacidad.

### Navigation
Encabezado fijo de 64px con borde inferior Línea Fina. Logo a la izquierda; enlaces en DM Sans 500 a 0.875rem en Pizarra que pasan a Azul Petróleo en hover; botón primario de cotizar a la derecha. En móvil, un panel lateral (sheet) con enlaces a 1.125rem y subenlaces con sangría de 16px.

## Do's and Don'ts

### Do:
- **Do** usar Azul Petróleo para toda acción principal y Petróleo Profundo para su hover.
- **Do** presentar cada sección pública con una píldora de presentación sobre un título en Playfair Display.
- **Do** mantener las tarjetas planas con borde fino y elevarlas solo en hover y enfoque (sombra teñida, −4px, 300ms).
- **Do** reservar el Púrpura Creativo para señalar lo que el cliente puede personalizar.
- **Do** usar los tokens (`bg-primary`, `text-muted-foreground`, `rounded-xl`…) en código nuevo en lugar de hex escritos a mano.
- **Do** mostrar la foto real del producto como el elemento más grande de cada tarjeta.

### Don't:
- **Don't** usar Playfair Display en botones, precios, etiquetas o texto corrido.
- **Don't** introducir un segundo color de acción que compita con el Azul Petróleo.
- **Don't** usar el Púrpura Creativo como decoración o para algo que no se pueda personalizar.
- **Don't** elevar ni animar superficies que no son clicables.
- **Don't** usar esquinas rectas en la interfaz pública.
- **Don't** agregar hex nuevos escritos a mano en los componentes.
