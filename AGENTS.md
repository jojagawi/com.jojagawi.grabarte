## AGENTS.md — guía para agentes

Este repositorio es **GrabArte**, un catálogo de productos personalizados construido con **Gatsby** (React + TypeScript) que permite mostrar y solicitar cotizaciones de objetos personalizados (termos, MDF, sellos, acrílico, cuero, figuras 3D, etc.). Incluye un panel de administración local con base de datos SQLite.

### Descripción del Proyecto

**GrabArte** tiene dos vertientes principales:

1. **Sitio Público** (`localhost:8000`):
   - Catálogo de productos personalizados
   - Páginas de descripción de productos
   - Sistema de solicitud de cotizaciones
   - Información de contacto y pedidos

2. **Panel Administrativo** (en desarrollo):
   - Gestión de catálogo en SQLite
   - Subida de archivos fuente (.psd, .ai, modelos 3D, etc.)
   - Administración de productos y precios

### Dependencias del Proyecto (Versiones Fijas)

Mantén estas versiones a menos que se justifique en un PR:

**Core Framework:**
- gatsby: ^5.14.6
- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.3.3

**Styling:**
- tailwindcss: ^4.3.2
- postcss: ^8.5.16

**Gatsby Plugins:**
- gatsby-plugin-image: ^3.16.0 (optimización de imágenes)
- gatsby-plugin-sharp: ^5.16.0 (procesamiento de imágenes)
- gatsby-transformer-sharp: ^5.16.0
- gatsby-source-filesystem: ^5.16.0 (acceso a archivos)
- gatsby-plugin-mdx: ^5.16.0 (soporte MDX)
- gatsby-plugin-postcss: ^6.16.0
- gatsby-plugin-manifest: ^5.16.0 (PWA)
- gatsby-plugin-sitemap: ^6.16.0 (SEO)
- gatsby-plugin-google-gtag: ^5.16.0 (analytics)

**Otras:**
- @mdx-js/react: ^3.1.1
- autoprefixer: ^10.5.2

---

## Requisitos de Entorno

Antes de trabajar, verifica que tienes las versiones mínimas:

```powershell
node -v       # >= 24.0.0
pnpm -v       # >= 11.0.0
sqlite3 --version  # si usas panel admin
```

Si pnpm no está instalado en Windows:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
```

---

## Comandos de Desarrollo

```powershell
# Instalar todas las dependencias
pnpm install

# Iniciar servidor de desarrollo (hot reload)
pnpm run develop
# o
pnpm run start
# Accede a: http://localhost:8000

# Compilar para producción
pnpm run build

# Servir la build local (requiere build previo)
pnpm run serve

# Verificar tipos TypeScript
pnpm run typecheck

# Limpiar caché de Gatsby
pnpm run clean

# Limpia + reinstala dependencias (para troubleshooting)
pnpm run clean && pnpm install
```

---

## Estructura del Proyecto

```
grabarte.mx/
├── .agents/
│   ├── instructions.md      # Estándares y guía de desarrollo
│   └── workflows/
│       └── check-style.md   # Checklist de verificación
├── src/
│   ├── images/              # Imágenes optimizadas (PNG, JPG, WebP)
│   │   ├── icon.png
│   │   ├── logo_01.png
│   │   ├── logo_02.png
│   │   └── logo_03.png
│   ├── pages/               # Páginas de Gatsby (generan rutas)
│   │   ├── 404.tsx          # Página de error
│   │   └── index.tsx        # Página principal
│   ├── components/          # Componentes React reutilizables (crear si es necesario)
│   ├── styles/              # Estilos globales
│   │   └── global.css
│   └── utils/               # Funciones utilitarias (crear si es necesario)
├── data/                    # Catálogo SQLite (crear si es necesario)
│   └── catalog.db           # Base de datos local
├── gatsby-config.ts         # Configuración de Gatsby
├── gatsby-browser.js        # Hooks del navegador
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
├── tsconfig.json            # Configuración de TypeScript
├── package.json
├── pnpm-lock.yaml           # Lock file (no editar manualmente)
├── AGENTS.md                # Este archivo
├── README.md                # Documentación del proyecto
└── .gitignore               # Archivos ignorados por git
```

---

## Checklist Antes de Trabajar

✅ **Hacer esto ANTES de hacer cambios:**

1. Verifica versiones:
   ```powershell
   node -v    # debe ser >= 24.0.0
   pnpm -v    # debe ser >= 11.0.0
   ```

2. Instala dependencias:
   ```powershell
   pnpm install
   ```

3. Inicia el servidor de desarrollo:
   ```powershell
   pnpm run develop
   ```
   Verifica que funciona en `http://localhost:8000`

4. Verifica que no hay errores de TypeScript:
   ```powershell
   pnpm run typecheck
   ```

5. Lee `.agents/instructions.md` para entender los estándares de código

---

## Convenciones de Código

### Archivos

- **Componentes**: `PascalCase.tsx` (ej: `ProductCard.tsx`)
- **Páginas**: `kebab-case.tsx` (ej: `catalog-page.tsx`, `404.tsx`)
- **Utilities**: `camelCase.ts` (ej: `fetchProduct.ts`, `useProductData.ts`)

### TypeScript

- Indentación: **2 espacios** (no tabs)
- Tipos explícitos: ❌ `any` → ✅ tipos definidos
- Imports: Externas → Utilitarios → Componentes → Estilos
- Exports: Named exports preferidos (mejor tree-shaking)

### React + JSX

- Todos los componentes deben ser **named** (no arrow functions anónimas)
- Props con **interface/type** definido
- Imágenes: Siempre con **alt** descriptivo
- Accesibilidad: Jerarquía correcta de headings, botones semánticamente correctos

### Estilos

- **Tailwind CSS**: Primera opción para estilos
- CSS Global: Solo para estilos verdaderamente globales
- Variables CSS: Define en `src/styles/global.css` si es necesario
- No mezcles demasiadas clases inline, considera componentes

---

## Antes de Hacer Commit

✅ **Ejecuta siempre:**

```powershell
# Verifica tipos
pnpm run typecheck

# Compila para producción
pnpm run build

# Si ambos pasan, estás listo para commit
```

✅ **Mensaje de commit:**

```
feat: descripción clara en español
fix: corrección de bug específico
docs: actualización de documentación
```

Ejemplo:
```
feat: agregar página de productos con filtros
fix: corregir responsive del hero en mobile
```

---

## Notas de Seguridad

- ❌ Nunca comitees: API keys, secretos, credenciales, o archivos `.env.local`
- ✅ Usa variables de entorno con prefijo `GATSBY_` para datos públicos
- ✅ Crea `.env.local` para desarrollo local (agrega a `.gitignore`)
- ✅ Revisa dependencias nuevas con `pnpm audit` antes de instalar

Ejemplo `.env.local` (NO comitees esto):

```env
GATSBY_ADMIN_ENABLED=true
GATSBY_DB_PATH=./data/catalog.db
```

---

## Troubleshooting

### Puerto 8000 ya está en uso

```powershell
# Encuentra el proceso
netstat -ano | findstr :8000

# Mata el proceso por PID
taskkill /PID <PID> /F

# O usa un puerto diferente
gatsby develop -p 3000
```

### Errores de TypeScript

```powershell
pnpm run typecheck
# Lee los errores y corrígelos

# Evita usar 'any'
❌ const data: any = {}
✅ interface Product { ... }
   const data: Product = {}
```

### Gatsby caché corrupto

```powershell
pnpm run clean
pnpm install
pnpm run develop
```

### Build falla

```powershell
# Limpia y recompila
pnpm run clean
pnpm run build

# Si persiste, revisa que no haya errores de TypeScript
pnpm run typecheck
```

---

## Panel Administrativo Local (SQLite)

**Estructura esperada** (cuando esté implementado):

- Base de datos: `./data/catalog.db`
- Schema: Productos, categorías, atributos personalizables
- Archivos subidos: Almacenados en `./data/uploads/`
- API local: Endpoints en `src/api/` (si se usa serverless functions)

**Variables de entorno necesarias:**

```env
GATSBY_ADMIN_ENABLED=true
GATSBY_DB_PATH=./data/catalog.db
GATSBY_UPLOAD_DIR=./data/uploads/
```

---

## Contacto y Referencias

- **Mantenedor**: Equipo GrabArte
- **Documentación**: Ver `README.md` para guía de usuario
- **Estándares**: Ver `.agents/instructions.md` para detalles de código
- **Workflows**: Ver `.agents/workflows/` para checklists

---

**Última actualización**: Julio 2026
**Stack**: Gatsby 5 + React 18 + TypeScript + Tailwind CSS
**Hosting**: (Por configurar)
**Base de datos**: SQLite (local) / (Por configurar en producción)

