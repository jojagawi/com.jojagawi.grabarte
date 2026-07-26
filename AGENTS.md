## AGENTS.md — guía para agentes

Este repositorio es **InspiraArte**, un catálogo de productos personalizados construido con **next** (React + TypeScript) que permite mostrar y solicitar cotizaciones de objetos personalizados (termos, MDF, sellos, acrílico, cuero, figuras 3D, etc.). Incluye un panel de administración local con base de datos SQLite.

### Descripción del Proyecto

**InspiraArte** tiene dos vertientes principales:

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

- next: ^16
- react: ^19
- react-dom: ^19
- typescript: ^5

**Styling:**

- tailwindcss: ^4
- postcss: ^8

**Next Plugins:**

**Otras:**

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
pnpm run dev
# o
pnpm run start
# Accede a: http://localhost:3000

# Compilar para producción
pnpm run build

# Servir la build local (requiere build previo)
pnpm run serve

# Verificar tipos TypeScript
pnpm run typecheck

# Limpiar caché de Next
pnpm store prune

# Limpia + reinstala dependencias (para troubleshooting)
pnpm store prune && pnpm install
```

---

## Estructura del Proyecto

```
/
├── .agents/
│   ├── instructions.md      # Estándares y guía de desarrollo
│   └── workflows/
│       └── check-style.md   # Checklist de verificación
├── src/
│   ├── app/               # Páginas de next (generan rutas)
│   │   ├── 404.tsx          # Página de error
│   │   └── index.tsx        # Página principal
│   ├── components/          # Componentes React reutilizables (crear si es necesario)
│   ├── styles/              # Estilos globales
│   │   └── global.css
│   └── utils/               # Funciones utilitarias (crear si es necesario)
├── data/                    # Catálogo SQLite (crear si es necesario)
│   └── catalog.db           # Base de datos local
├── next.config.ts           # Configuración de Next.js
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
   pnpm run dev
   ```

   Verifica que funciona en `http://localhost:3000`

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
pnpm run test:typecheck

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
- ✅ Usa variables de entorno con prefijo `NEXT_` para datos públicos
- ✅ Crea `.env.local` para desarrollo local (agrega a `.gitignore`)
- ✅ Revisa dependencias nuevas con `pnpm audit` antes de instalar

Ejemplo `.env.local` (NO comitees esto):

```env
NEXT_ADMIN_ENABLED=true
NEXT_DB_PATH=./data/catalog.db
```

---

## Troubleshooting

### Puerto 3000 ya está en uso

```powershell
# Encuentra el proceso
netstat -ano | findstr :3000

# Mata el proceso por PID
taskkill /PID <PID> /F

```

### Errores de TypeScript

```powershell
pnpm run test:typecheck
# Lee los errores y corrígelos

# Evita usar 'any'
❌ const data: any = {}
✅ interface Product { ... }
   const data: Product = {}
```

### Next caché corrupto

```powershell
pnpm run clean
pnpm install
pnpm run dev
```

### Build falla

```powershell
# Limpia y recompila
pnpm run clean
pnpm run build

# Si persiste, revisa que no haya errores de TypeScript
pnpm run test:typecheck
```

---

## Panel Administrativo Local (SQLite)

**Estructura esperada** (cuando esté implementado):

- Base de datos: `./data/mydb.sqlite`
- Schema: Productos, categorías, atributos personalizables
- Archivos subidos: Almacenados en un s3 de amazon o localmente en `./data/uploads/`
- API local: Endpoints en `src/api/` (si se usa serverless functions)

**Variables de entorno necesarias:**

```env
NEXT_ADMIN_ENABLED=true
NEXT_DB_PATH=./data/catalog.db
NEXT_UPLOAD_DIR=./data/uploads/
```

---

## Contacto y Referencias

- **Mantenedor**: Equipo InspiraArte
- **Documentación**: Ver `README.md` para guía de usuario
- **Estándares**: Ver `.agents/instructions.md` para detalles de código
- **Workflows**: Ver `.agents/workflows/` para checklists

---

**Última actualización**: Julio 2026
**Stack**: Next 16 + React 19 + TypeScript + Tailwind CSS
**Hosting**: AWS S3 + CloudFlare CDN
**Base de datos**: SQLite (local)
