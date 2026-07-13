# GrabArte — Catálogo de Productos Personalizados

![Status](https://img.shields.io/badge/status-development-blue)
![Node](https://img.shields.io/badge/node->%3D24.0.0-green)
![pnpm](https://img.shields.io/badge/pnpm->%3D11.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)

**GrabArte** es un catálogo de productos personalizados construido con **Gatsby** y **React** que permite a los clientes explorar y solicitar cotizaciones de objetos personalizados (termos, MDF, sellos, acrílico, cuero, figuras 3D, etc.).

---

## 🎯 Características Principales

### 📱 Sitio Público

- ✅ Catálogo de productos personalizados
- ✅ Páginas de detalle de productos
- ✅ Sistema de solicitud de cotizaciones
- ✅ Información de contacto e integración de formularios
- ✅ Optimización SEO con Gatsby
- ✅ Sitemap automático

### 🛠️ Panel Administrativo Local (En Desarrollo)

- 🔲 Gestión de catálogo con SQLite
- 🔲 Subida de archivos fuente (.psd, .ai, modelos 3D)
- 🔲 Administración de productos, categorías y precios
- 🔲 Respaldo de datos

---

## 📋 Requisitos

Asegúrate de tener instalados:

- **Node.js**: >= 24.0.0
- **pnpm**: >= 11.0.0
- **Git**: Para control de versiones

### Verifica las versiones:

```powershell
node -v
pnpm -v
```

### Si pnpm no está instalado:

```powershell
# En Windows con Corepack (incluido en Node >= 16.13)
corepack enable
corepack prepare pnpm@latest --activate
```

---

## 🚀 Instalación y Desarrollo

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd grabarte.mx
```

### 2. Instalar Dependencias

```powershell
pnpm install
```

### 3. Iniciar Servidor de Desarrollo

```powershell
pnpm run develop
```

El sitio estará disponible en **http://localhost:8000**

---

## 📦 Comandos Disponibles

```powershell
# Instalar todas las dependencias
pnpm install

# Iniciar desarrollo con hot reload
pnpm run develop
pnpm run start    # alias

# Compilar para producción
pnpm run build

# Servir la compilación local
pnpm run serve    # requiere pnpm run build primero

# Verificar tipos TypeScript
pnpm run typecheck

# Limpiar caché de Gatsby
pnpm run clean

# Limpieza profunda (nuclear option)
pnpm run clean && pnpm install
```

---

## 📁 Estructura del Proyecto

```
grabarte.mx/
├── .agents/                      # Guía para agentes
│   ├── instructions.md           # Estándares de código
│   └── workflows/
│       └── check-style.md        # Checklist de verificación
├── src/
│   ├── components/               # Componentes React reutilizables
│   │   └── (crear según necesidad)
│   ├── images/                   # Imágenes optimizadas
│   │   ├── icon.png
│   │   ├── logo_01.png
│   │   ├── logo_02.png
│   │   └── logo_03.png
│   ├── pages/                    # Páginas de Gatsby
│   │   ├── 404.tsx               # Página de error
│   │   └── index.tsx             # Página principal
│   ├── styles/                   # Estilos globales
│   │   └── global.css
│   └── utils/                    # Funciones utilitarias
│       └── (crear según necesidad)
├── data/                         # Base de datos local
│   └── catalog.db                # SQLite (crear según necesidad)
├── .env.local                    # Variables de entorno local (NO comitees)
├── .gitignore                    # Archivos ignorados por git
├── gatsby-browser.js             # Hooks del navegador
├── gatsby-config.ts              # Configuración de Gatsby
├── package.json                  # Dependencias del proyecto
├── pnpm-lock.yaml                # Lock file
├── postcss.config.js             # Configuración de PostCSS
├── tailwind.config.js            # Configuración de Tailwind CSS
├── tsconfig.json                 # Configuración de TypeScript
├── AGENTS.md                     # Guía para agentes
└── README.md                     # Este archivo
```

---

## 🎨 Stack Tecnológico

| Herramienta      | Versión | Propósito            |
| ---------------- | ------- | -------------------- |
| **Gatsby**       | ^5.14.6 | Framework SSG/SSR    |
| **React**        | ^18.2.0 | Componentes UI       |
| **TypeScript**   | ^5.3.3  | Seguridad de tipos   |
| **Tailwind CSS** | ^4.3.2  | Estilos utilitarios  |
| **PostCSS**      | ^8.5.16 | Procesamiento de CSS |
| **MDX**          | ^3.1.1  | Markdown + JSX       |
| **SQLite**       | -       | Base de datos local  |

---

## 📝 Convenciones de Código

### Archivos

```typescript
// Componentes React
PascalCase.tsx
// Ejemplo: ProductCard.tsx, HeroSection.tsx

// Páginas de Gatsby
kebab-case.tsx
// Ejemplo: catalog-page.tsx, about-page.tsx

// Utilidades y hooks
camelCase.ts
// Ejemplo: useProductData.ts, fetchProducts.ts
```

### TypeScript

- **Indentación**: 2 espacios
- **Tipos**: Siempre explícitos (❌ `any` → ✅ `interface` o `type`)
- **Exports**: Named exports preferidos
- **Imports**: Externas → Utilidades → Componentes → Estilos

**Ejemplo:**

```typescript
import React from 'react';
import { fetchProducts } from '../utils/api';
import { ProductCard } from './ProductCard';
import '../styles/products.css';

interface Product {
  id: string;
  name: string;
  image: string;
}

export const ProductList: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

### React + JSX

- ✅ Componentes nombrados (no anonymous functions)
- ✅ Props con `interface` o `type`
- ✅ Imágenes con `alt` descriptivo
- ✅ Accesibilidad: headings semánticamente correctos
- ✅ Tailwind CSS para estilos

### Accesibilidad

```typescript
// ✅ Correcto
<img
  src="product.jpg"
  alt="Termo personalizado rojo - GrabArte"
/>

// ✅ Correcto
<h1>Catálogo de Productos</h1>
<h2>Selecciona tu categoría</h2>

// ❌ Incorrecto
<img src="product.jpg" />
<div className="title">Catálogo de Productos</div>
```

---

## 🔐 Seguridad

### ⚠️ Nunca Comitees

- API keys o credenciales
- Archivos `.env.local`
- Datos sensibles
- Contraseñas

### ✅ Mejores Prácticas

1. Crea `.env.local` para desarrollo local:

```env
GATSBY_ADMIN_ENABLED=true
GATSBY_DB_PATH=./data/catalog.db
```

2. Agrega a `.gitignore`:

```
.env.local
data/catalog.db
node_modules/
.cache/
public/
```

3. Revisa dependencias nuevas:

```powershell
pnpm audit
pnpm add <package>  # solo si no hay vulnerabilidades críticas
```

---

## 🐛 Troubleshooting

### Puerto 8000 ya en uso

```powershell
# Encuentra el proceso
netstat -ano | findstr :8000

# Mata el proceso
taskkill /PID <PID> /F

# O usa otro puerto
gatsby develop -p 3000
```

### Errores de TypeScript

```powershell
pnpm run typecheck

# Corrige el tipo
❌ const data: any = {}
✅ interface Product { id: string; }
   const data: Product = { id: '1' };
```

### Caché corrupto de Gatsby

```powershell
pnpm run clean
pnpm install
pnpm run develop
```

### Build falla

```powershell
# Verifica tipos primero
pnpm run typecheck

# Luego intenta compilar
pnpm run build

# Si persiste, limpia completamente
pnpm run clean && pnpm install && pnpm run build
```

---

## 📚 Antes de Hacer Commit

**Checklist obligatorio:**

```powershell
# 1. Verifica tipos
pnpm run typecheck

# 2. Compila para producción
pnpm run build

# 3. Si ambos pasan, haz commit
git add .
git commit -m "feat: descripción clara en español"
```

**Formato de mensaje:**

```
feat: agregar página de catálogo de productos
fix: corregir responsive en mobile
docs: actualizar README
```

---

## 📱 Responsive Design

El sitio debe funcionar correctamente en:

- **Desktop**: 1920px, 1366px, 1024px
- **Tablet**: 768px, 812px
- **Mobile**: 375px, 414px, 390px

Prueba con:

```powershell
pnpm run develop
# En DevTools: F12 → Device Toolbar (Ctrl+Shift+M)
```

---

## 🚢 Despliegue

### Build de Producción

```powershell
pnpm run build
```

Genera:

- `public/` - Sitio estático optimizado
- `pnpm-lock.yaml` - Dependencias fijadas

### Servir Localmente

```powershell
pnpm run serve
# http://localhost:9000
```

---

## 📊 SEO y Performance

### Optimizaciones Incluidas

- ✅ Sitemap automático (`gatsby-plugin-sitemap`)
- ✅ Imágenes optimizadas (`gatsby-plugin-image`)
- ✅ Meta tags (`gatsby-plugin-manifest`)
- ✅ Analytics (`gatsby-plugin-google-gtag`)

### Mejora Manual

1. Agrega meta tags en `gatsby-config.ts`
2. Describe productos con contenido único
3. Optimiza imágenes antes de subir
4. Usa palabras clave en headings

---

## 📞 Soporte y Contacto

- **Documentación de Desarrollo**: Ver `.agents/instructions.md`
- **Guía de Agentes**: Ver `AGENTS.md`
- **Workflows y Checklists**: Ver `.agents/workflows/`
- **Issues**: Crear una issue en el repositorio

---

## 📄 Licencia

(Por definir)

---

## 🙏 Créditos

- **Equipo GrabArte**
- **Stack**: Gatsby + React + TypeScript + Tailwind CSS
- **Última actualización**: Julio 2026

---

## 🔄 Control de Versiones

- **Rama principal**: `main` (producción)
- **Rama de desarrollo**: `develop` (desarrollo)
- **Ramas de feature**: `feature/descripcion` o `feat/descripcion`

Usa commits semánticos (feat, fix, docs, style, refactor, test, chore)

---

**Para comenzar**: `pnpm install && pnpm run develop` 🚀
