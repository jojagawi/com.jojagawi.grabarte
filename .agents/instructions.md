# Instrucciones del proyecto GrabArte

Este documento contiene los estandares obligatorios para contribuir al sitio web de **GrabArte/InspiraArte**.

## Contexto del proyecto

El proyecto actual esta construido con **Next.js 16 (App Router)** + **React 19** + **TypeScript** + **Tailwind CSS 4**.

- **Sitio publico**: catalogo de productos personalizados.
- **Objetivo de despliegue**: sitio estatico para publicar en S3/CDN.
- **Salida de build**: carpeta `out/`.

Configuracion clave en `next.config.ts`:

- `output: "export"`
- `images.unoptimized: true`

## Requisitos de entorno

- **Node.js**: >= 24.0.0
- **pnpm**: >= 11.0.0
- **SQLite**: opcional para pruebas de datos locales

```powershell
node -v
pnpm -v
sqlite3 --version
```

Si falta `pnpm`:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
```

## Estructura del proyecto

```text
com.jojagawi.grabarte/
|- src/
|  |- app/                      # App Router (layout, page, globals)
|  |- components/
|  |  |- custom/                # Secciones de negocio
|  |  |- structure/             # Header/Footer
|  |  `- ui/                    # Componentes base
|  |- hooks/
|  `- lib/
|- data/
|  `- mydb.sqlite               # Datos locales/roadmap
|- .agents/
|  |- instructions.md
|  `- workflows/
|- next.config.ts
|- eslint.config.mjs
|- lighthouserc.cjs
|- package.json
`- README.md
```

## Estandares de codificacion

### TypeScript y JavaScript

- Indentacion de **2 espacios**.
- Evitar `any`; usar `type`/`interface`.
- Preferir exports nombrados; `default` solo cuando el framework lo requiere (`page.tsx`, `layout.tsx`).
- Orden de imports: externas -> internas (`@/`) -> estilos.

### React/Next

- Componentes nombrados y con props tipadas.
- Mantener separacion Server/Client Components; agregar `"use client"` solo cuando sea necesario.
- En `src/app`, respetar convenciones de App Router (`layout.tsx`, `page.tsx`, `error.tsx`, `global-error.tsx`).
- Accesibilidad obligatoria: `alt` descriptivo, labels en formularios y jerarquia correcta de headings.

### Estilos

- Tailwind como opcion principal.
- CSS global solo para tokens y estilos realmente globales (`src/app/globals.css`).
- Evitar clases excesivas repetidas: extraer componentes UI reutilizables.

## Dependencias base (mantener alineadas)

Mantener versiones en linea con `package.json` salvo justificacion en PR:

- `next` 16.x
- `react` 19.x
- `react-dom` 19.x
- `typescript` 5.x
- `tailwindcss` 4.x
- `postcss` 8.x

Agregar paquetes:

```powershell
pnpm add <package>
pnpm add -D <dev-package>
```

## Comandos de desarrollo

```powershell
# Instalar dependencias
pnpm install

# Desarrollo local (http://localhost:3000)
pnpm run dev

# Build de produccion (genera out/)
pnpm run build

# Servidor de produccion Node
pnpm run start

# Calidad
pnpm run test:typecheck
pnpm run test:lint
pnpm run test:style:check
pnpm run test:format:check
pnpm run test:lighthouse
pnpm run test:all
pnpm run ci
```

## Panel administrativo / datos locales

- La base local actual disponible es `data/mydb.sqlite`.
- Si se habilita admin local, usar variables de entorno y no hardcodear rutas.

Ejemplo:

```env
NEXT_ADMIN_ENABLED=true
NEXT_DB_PATH=./data/catalog.db
NEXT_UPLOAD_DIR=./data/uploads/
```

## Checklist antes de cada cambio

1. Verificar versiones de Node y pnpm.
2. Ejecutar `pnpm install` si cambian dependencias.
3. Probar en local con `pnpm run dev`.
4. Ejecutar `pnpm run test:typecheck`.
5. Validar lint/format segun el alcance (`test:lint`, `test:format:check`).
6. Si el cambio afecta entrega, ejecutar `pnpm run build` y validar `out/`.

## Convenciones de commits y PR

- Mensajes en espanol y semanticos: `feat:`, `fix:`, `docs:`, `refactor:`.
- Incluir en el PR:
  - objetivo del cambio,
  - impacto tecnico,
  - evidencia de validacion (comandos corridos).

## Seguridad

- Nunca comitear secretos ni `.env.local`.
- Revisar nuevas dependencias con `pnpm audit`.
- No exponer datos sensibles en logs ni ejemplos.

## Troubleshooting

### Puerto 3000 en uso

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build/cache inconsistente de Next

```powershell
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item out -Recurse -Force -ErrorAction SilentlyContinue
pnpm install
pnpm run build
```

### TypeScript con errores

```powershell
pnpm run test:typecheck
```

## Nota de despliegue

Para despliegue estatico en S3, publicar el contenido de `out/`.

---

**Ultima actualizacion**: Julio 2026
**Mantenedor**: Equipo GrabArte
