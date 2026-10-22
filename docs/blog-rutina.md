# Rutina de borradores del blog

Instrucciones fijas de la rutina programada de Claude que escribe un borrador del blog los días 1 y 15 de cada mes y lo entrega como Pull Request. Nada se publica sin que Jorge haga merge. Editar este archivo cambia cómo trabaja la rutina en su siguiente corrida.

## 1. Elegir el tema

1. Parte de `main` actualizado y crea una rama nueva desde `main` (nunca hagas commit en `main`).
2. Lee [blog-calendario.md](blog-calendario.md). Toma la primera fila en estado `pendiente` cuyo `publishAt` sea anterior a hoy o caiga en los próximos 21 días.
3. Si no hay ninguna, o ya hay un Pull Request abierto para esa fila (busca PRs abiertos con "feat(blog)" en el título), no hagas nada y avisa en el hilo que no tocaba artículo.

## 2. Juntar los datos

- Productos: `pnpm run blog:products -- <temporada>` (o sin temporada para todo el catálogo). Solo puedes mencionar productos de esa lista, con su ID. Si la temporada tiene menos de 4 productos, completa con productos del catálogo completo que encajen con el tema y dilo en el PR.
- Tono: el perfil "Catalogo InspiraArte" de `SeoWriterProfiles` en `data/mydb.sqlite` ("Cercano, creativo y comercial sin exageraciones").
- Hechos del negocio que sí puedes afirmar (son los que ya publica el sitio en `/faq`, `/proceso` y las guías de temporada): propuesta de diseño antes de producir; pedidos pequeños en 3 a 4 días hábiles; no hay pedido mínimo; descuento desde 10 piezas y mejores precios desde 50; factura; envío a todo México; recoger en el taller en la Ciudad de México sin costo; las piezas de MDF se entregan en madera natural para pintar.
- Palabras clave: usa la búsqueda real de la gente en México. "Nacimiento" y nunca "pesebre"; "XV años"; "Día de las madres". No repitas en el título la palabra principal de la guía de temporada: el artículo responde una pregunta más específica y enlaza a la guía.
- No inventes: ni precios, ni medidas, ni tiempos, ni estadísticas, ni testimonios, ni fechas que no estén en la base o en esta lista. Si un dato hace falta y no lo tienes, déjalo fuera o pregúntalo en el PR.

## 3. Escribir el artículo

Archivo `content/blog/<slug>.md` con el formato de [blog.md](blog.md). El slug sale del título, en minúsculas y con guiones.

- Encabezado: `status: published`, `publishAt` de la fila (o la fecha de hoy si ya pasó), `updatedAt` igual a `publishAt`, `season` de la fila y en `products` de 4 a 12 IDs, el más representativo primero (su foto es la imagen del artículo).
- Título de máximo 60 caracteres y descripción de máximo 160.
- Primer párrafo de 2 o 3 frases que responde directo la pregunta del título.
- Secciones `##` escritas como preguntas o como lo que la persona busca.
- Una o más tablas de productos con `[nombre](producto:ID)` y `{{precio:ID}}`. Nunca escribas un precio ni una URL de producto a mano.
- Un enlace a la guía de la temporada: `/temporada/<temporada>/`.
- Cierra con `## Preguntas frecuentes` y de 3 a 5 preguntas como `###`, cada una con su respuesta en un párrafo.
- Entre 700 y 1,400 palabras, en español de México.

## 4. Revisar y entregar

1. `pnpm run blog:check` debe terminar con 0 errores. Corrige también los avisos que puedas.
2. En [blog-calendario.md](blog-calendario.md) cambia la fila a `borrador` y escribe el nombre del archivo.
3. Commit `feat(blog): <título>`, push de la rama y Pull Request a `main` con:
   - el título y la descripción del artículo, la fecha de publicación y por qué ese tema ahora;
   - los productos usados y si faltaron productos publicados para la temporada;
   - lo que Jorge debe revisar (datos dudosos, preguntas abiertas);
   - recordatorio: al hacer merge el artículo sale en el siguiente deploy si `publishAt` ya pasó, o el lunes a las 5:00 después de esa fecha.
4. Asigna el PR a `jojagawi` y deja el enlace en el hilo del proyecto.
5. Si Jorge pide cambios en el PR, corrígelos en la misma rama.

Cuando el PR se haga merge, la siguiente corrida cambia esa fila a `publicado`.
