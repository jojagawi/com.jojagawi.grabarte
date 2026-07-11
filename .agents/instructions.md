# Instrucciones del proyecto GrabArte

Este documento contiene los estándares de codificación obligatorios y las reglas de desarrollo para **GrabArte**. Todos los agentes deben seguir estas reglas estrictamente.

GrabArte es un sitio web de catálogo de productos personalizados construido con **Gatsby** (React + TypeScript) que incluye:
- **Sitio Público**: Catálogo de productos personalizados (termos, MDF, sellos, acrílico, cuero, figuras 3D, etc.)
- **Panel Administrativo Local**: Gestión de catálogo con base de datos SQLite

---

## Requisitos de Entorno

- **Node.js**: >= 24.0.0
- **pnpm**: >= 11.0.0
- **SQLite**: Para administración de catálogo en desarrollo local

Verifica las versiones instaladas:

```powershell
node -v
pnpm -v
sqlite3 --version
```

Si `pnpm` no está instalado y tu Node incluye Corepack:

```powershell
corepack enable; corepack prepare pnpm@latest --activate
```

---

## Estructura del Proyecto

```
grabarte.mx/
├── src/
│   ├── images/              # Activos de imagen optimizados
│   ├── pages/               # Páginas de Gatsby (TSX)
│   │   ├── 404.tsx
│   │   └── index.tsx
│   ├── components/          # Componentes React reutilizables (si aplica)
│   ├── styles/              # Estilos globales (Tailwind + CSS)
│   └── utils/               # Funciones utilitarias (si aplica)
├── .agents/
│   ├── instructions.md      # Este archivo
│   └── workflows/           # Automatización y checklists
├── gatsby-config.ts         # Configuración de Gatsby
├── gatsby-browser.js        # Hook del navegador
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
├── tsconfig.json            # Configuración de TypeScript
├── package.json             # Dependencias del proyecto
└── README.md                # Documentación del proyecto
```

---

## Estándares de Codificación

### TypeScript y JavaScript

- **Indentación**: 2 espacios consistentemente
- **Tipo de punto y coma**: Requerido (`;` al final de sentencias)
- **Nombres de archivos**:
  - Componentes: `PascalCase` (ej: `ProductCard.tsx`)
  - Funciones/hooks: `camelCase` (ej: `useProductData.ts`)
  - Páginas: `kebab-case` (ej: `catalog-page.tsx`)
- **Exportaciones**: Usa exports nombrados para mejor tree-shaking, excepto en páginas donde se requiere default export
- **Imports**: Agrupa por: dependencias externas → utilitarios → componentes → estilos

### Componentes React

- **Nombrado**: Todos los componentes deben ser nombrados (no anonymous functions)
- **Props**: Define interfaces/types para todas las props
- **TypeScript**: Usa tipos explícitos, evita `any`
- **Accesibilidad**:
  - Siempre incluye `alt` en imágenes
  - Usa roles ARIA cuando sea necesario
  - Jerarquía correcta de headings (`<h1>` → `<h2>` → etc.)
  - Etiquetas semánticas HTML5

**Ejemplo:**

```typescript
interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  onSelect: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  onSelect,
}) => {
  return (
    <div className="product-card">
      <img src={image} alt={`${name} - Producto personalizado`} />
      <h3>{name}</h3>
      <p className="price">${price}</p>
      <button onClick={() => onSelect(id)}>Solicitar cotización</button>
    </div>
  );
};
```

### Estilos con TailwindCSS

- **Preferencia**: Usa clases de Tailwind en lugar de CSS global
- **Configuración**: Modifica `tailwind.config.js` para colores y temas personalizados
- **Variables CSS**: Define en `src/styles/global.css` usando `@layer`
- **Evita**: Mezclar demasiado CSS global, usa Tailwind como primera opción
- **Performance**: Gatsby + PostCSS optimiza automáticamente

---

## Dependencias del Proyecto

Mantén las versiones actuales a menos que se justifique en un PR:

- **gatsby**: ^5.14.6
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **typescript**: ^5.3.3
- **tailwindcss**: ^4.3.2
- **postcss**: ^8.5.16
- **@mdx-js/react**: ^3.1.1
- **gatsby-plugin-image**: ^3.16.0
- **gatsby-plugin-sharp**: ^5.16.0
- **gatsby-transformer-sharp**: ^5.16.0
- **gatsby-source-filesystem**: ^5.16.0
- **gatsby-plugin-mdx**: ^5.16.0
- **gatsby-plugin-postcss**: ^6.16.0
- **gatsby-plugin-manifest**: ^5.16.0
- **gatsby-plugin-sitemap**: ^6.16.0
- **gatsby-plugin-google-gtag**: ^5.16.0

**Agregar nuevas dependencias**: `pnpm add <package>` o `pnpm add -D <dev-package>`

---

## Comandos de Desarrollo

```powershell
# Instalar dependencias
pnpm install

# Desarrollar localmente (hot reload en localhost:8000)
pnpm run develop
# o
pnpm run start

# Compilar para producción
pnpm run build

# Servir build local (requiere `pnpm run build` primero)
pnpm run serve

# Verificar tipos TypeScript
pnpm run typecheck

# Limpiar caché de Gatsby
pnpm run clean
```

---

## Panel Administrativo (Desarrollo Local)

Para administrar el catálogo con SQLite:

1. **Estructura esperada**: La base de datos SQLite debe estar en `./data/catalog.db`
2. **Inicialización**: Crea un script en `src/admin/` para inicializar tablas
3. **API local**: Usa endpoints en `gatsby-node.ts` o crea rutas serverless si aplica
4. **Variables de entorno**: Crea `.env.local` para rutas y credenciales

Ejemplo de variables:

```env
GATSBY_ADMIN_ENABLED=true
GATSBY_DB_PATH=./data/catalog.db
```

---

## Checklist Antes de Cada Cambio

1. ✅ Verifica Node.js >= 24.0.0 y pnpm >= 11.0.0
2. ✅ Ejecuta `pnpm install` si hay cambios en `package.json`
3. ✅ Inicia `pnpm run develop` y prueba localmente en `localhost:8000`
4. ✅ Ejecuta `pnpm run typecheck` y corrige errores TS
5. ✅ Revisa componentes: nombres, tipos, accesibilidad
6. ✅ Optimiza imágenes en `src/images/` (usa `gatsby-plugin-image`)

---

## Convenciones de Commits y PRs

- **Mensaje**: Descriptivo en español (ej: "feat: añadir página de catálogo" o "fix: corregir responsive en hero")
- **Scope**: Opcional pero recomendado (ej: `feat(catalog): ...`)
- **Descripción en PR**: Incluye URL de preview (`localhost:8000`) y detalles del cambio
- **Antes de mergear**:
  - ✅ `pnpm run typecheck` sin errores
  - ✅ Imágenes optimizadas
  - ✅ Accesibilidad verificada
  - ✅ Responsive probado en mobile/tablet/desktop

---

## Notas de Seguridad

- ❌ **Nunca** comitees secretos, API keys o credenciales
- ✅ Usa `.env.local` y `.env.production` para valores sensibles
- ✅ Agrega `.env.local` a `.gitignore`
- ✅ Revisa dependencias con `pnpm audit` antes de agregar paquetes nuevos
- ✅ Evita paquetes sin mantenimiento o con pocos descargas

---

## Troubleshooting

### "Port 8000 is already in use"
```powershell
# En Windows, encuentra el proceso
netstat -ano | findstr :8000
# Mata el proceso por PID
taskkill /PID <PID> /F
```

### Error de tipos TypeScript
```powershell
pnpm run typecheck
# Revisa los errores y corrígelos
```

### Gatsby cache corrupto
```powershell
pnpm run clean
pnpm install
pnpm run develop
```

### Imagen no optimizada
Usa `gatsby-image` para optimización automática:

```typescript
import { StaticImage } from "gatsby-plugin-image";

export const Hero = () => (
  <StaticImage
    src="../images/hero.jpg"
    alt="Catálogo de productos personalizados"
  />
);
```

---

**Última actualización**: Julio 2026
**Mantenedor**: Equipo GrabArte
