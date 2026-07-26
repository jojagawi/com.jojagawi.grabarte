# InspiraArte - Catalogo Web Estatico

![Status](https://img.shields.io/badge/status-development-blue)
![Node](https://img.shields.io/badge/node->%3D24.0.0-green)
![pnpm](https://img.shields.io/badge/pnpm->%3D11.0.0-blue)
![Next](https://img.shields.io/badge/Next-16-black)

Este repositorio contiene el sitio publico de catalogo para productos personalizados. La arquitectura actual esta basada en **Next.js 16 + App Router + React 19 + Tailwind CSS 4** con **exportacion estatica** para despliegue en **S3/CDN**.

## Estado de la arquitectura (actualizado)

- **Framework principal**: Next.js (`src/app`, App Router).
- **Render objetivo**: sitio estatico (`next.config.ts` usa `output: "export"`).
- **Salida de build para deploy**: carpeta `out/`.
- **Imagenes**: `images.unoptimized: true` para compatibilidad con hosting estatico sin servidor de optimizacion de Next.
- **Calidad**: ESLint + TypeScript + Stylelint + Prettier + Lighthouse CI.
- **Datos locales**: existe `data/mydb.sqlite` como soporte local/roadmap.

## Requisitos

- **Node.js** >= 24.0.0
- **pnpm** >= 11.0.0

```powershell
node -v
pnpm -v
```

Si falta pnpm en Windows:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
```

## Inicio rapido

1. Instalar dependencias

```powershell
pnpm install
```

2. Levantar entorno local

```powershell
pnpm run dev
```

3. Abrir en navegador

- `http://localhost:3000`

## Scripts disponibles

```powershell
# Desarrollo
pnpm run dev

# Build de produccion
pnpm run build

# Levantar modo produccion (Node server)
pnpm run start

# Calidad
pnpm run test:typecheck
pnpm run test:lint
pnpm run test:style:check
pnpm run test:format:check
pnpm run test:lighthouse
pnpm run test:all

# Pipeline local CI
pnpm run ci
```

## Estructura actual

```text
.
|- src/
|  |- app/                    # App Router de Next
|  |  |- layout.tsx           # Layout raiz + metadata base
|  |  |- page.tsx             # Home
|  |  `- globals.css          # Estilos globales (Tailwind)
|  |- components/
|  |  |- custom/              # Secciones de negocio (hero, products, faq, etc.)
|  |  |- structure/           # Header / Footer
|  |  `- ui/                  # Componentes base UI
|  |- hooks/
|  `- lib/
|- data/
|  `- mydb.sqlite             # Base local (roadmap/admin local)
|- next.config.ts             # output: export, images.unoptimized
|- lighthouserc.cjs           # Auditoria sobre out/
|- eslint.config.mjs          # Next core-web-vitals + TS + jsx-a11y
|- package.json
`- README.md
```

## Build estatico y despliegue a S3

Generar build:

```powershell
pnpm run build
```

Carpeta que debes publicar en S3:

- `out/`

Notas para deploy:

- Sube el **contenido** de `out/` al bucket (no la carpeta contenedora vacia en un subnivel no deseado).
- Configura `index.html` como documento principal del hosting estatico.
- Si usas CDN (por ejemplo CloudFront), invalida cache tras cada release.

## Calidad y validaciones

- `test:all` ejecuta lint, style check, format check y typecheck.
- `test:lighthouse` usa `lighthouserc.cjs` y audita el sitio estatico generado en `out/`.
- Los reportes de Lighthouse se guardan en `ci/lighthouse/`.

## Variables de entorno (referencia)

Segun el roadmap/documentacion interna, se contemplan variables como:

```env
NEXT_ADMIN_ENABLED=true
NEXT_DB_PATH=./data/catalog.db
NEXT_UPLOAD_DIR=./data/uploads/
```

No comitear `.env.local` ni secretos.

## Troubleshooting rapido

Puerto 3000 en uso:

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Cache/build inconsistente:

```powershell
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item out -Recurse -Force -ErrorAction SilentlyContinue
pnpm install
pnpm run build
```

## Convenciones de commit

```text
feat: descripcion clara en espanol
fix: correccion de bug especifico
docs: actualizacion de documentacion
```

## Referencias internas

- `AGENTS.md`
- `.agents/instructions.md`
- `.agents/workflows/`

---

Ultima actualizacion: Julio 2026
