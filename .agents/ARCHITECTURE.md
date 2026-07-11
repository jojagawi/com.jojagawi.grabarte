# ARCHITECTURE.md — Arquitectura de GrabArte

Este documento describe la arquitectura completa de **GrabArte**, incluyendo el sitio público y el panel administrativo con SQLite.

---

## 🏗️ Visión General

GrabArte se divide en dos componentes principales:

### 1. Sitio Público (Gatsby SSG)

```
Gatsby (Static Site Generation)
├── Páginas estáticas compiladas
├── API interna (GraphQL de Gatsby)
├── Catálogo dinámico (datos de JSON o MDX)
└── Sistema de cotizaciones (contacto/formularios)
```

**Tecnología:**
- Gatsby 5 (SSG - Static Site Generation)
- React 18 para componentes
- TypeScript para seguridad de tipos
- Tailwind CSS para estilos

**Datos:**
- Productos: JSON, MDX, o GraphQL source
- Categorías: Termos, MDF, Sellos, Acrílico, Cuero, Figuras 3D
- Imágenes: Optimizadas con `gatsby-plugin-image`

---

### 2. Panel Administrativo Local (Node.js + SQLite)

```
Panel Admin (Desarrollo Local)
├── API REST/GraphQL (Node/Express)
├── Base de datos SQLite
├── Upload de archivos
├── Gestión de catálogo
└── Respaldo de datos
```

**Tecnología:**
- Node.js + Express (o similar)
- SQLite para persistencia
- Multer para upload de archivos
- CORS para comunicación con Gatsby

**Características:**
- Autenticación básica (en desarrollo)
- CRUD de productos
- Carga de archivos fuente (.psd, .ai, modelos 3D)
- Respaldo y exportación de datos

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────┐
│                    GrabArte                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────────┐  │
│  │  Sitio Público   │         │ Panel Admin (Local)  │  │
│  │   (localhost:8000)         │  (localhost:3000)    │  │
│  ├──────────────────┤         ├──────────────────────┤  │
│  │  - Catálogo      │◄────────┤  - Gestión datos     │  │
│  │  - Productos     │  sync   │  - Upload archivos   │  │
│  │  - Cotizaciones  │────────►│  - SQLite DB         │  │
│  │  - Contacto      │         │  - API REST          │  │
│  └──────────────────┘         └──────────────────────┘  │
│         │                              │                 │
│         └──────────────┬───────────────┘                 │
│                        ▼                                 │
│                  data/catalog.db                         │
│                   (SQLite Local)                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Esquema de Base de Datos SQLite

### Tabla: `products`

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,           -- termos, mdf, sellos, acrilico, cuero, figuras_3d
  description TEXT,
  price_base REAL,                  -- precio base
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  customization_options TEXT        -- JSON: ["color", "gravado", "material"]
);
```

### Tabla: `categories`

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,        -- Termos, MDF, Sellos, etc.
  description TEXT,
  icon_url TEXT,
  order_index INTEGER
);
```

### Tabla: `customization_options`

```sql
CREATE TABLE customization_options (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,               -- "Color", "Grabado", "Material"
  values TEXT NOT NULL,             -- JSON: ["Rojo", "Azul", "Verde"]
  price_modifier REAL DEFAULT 0,    -- sobreprecio
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Tabla: `quotes`

```sql
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  customization_details TEXT,       -- JSON con opciones seleccionadas
  estimated_total REAL,
  status TEXT DEFAULT 'pending',    -- pending, accepted, rejected
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Tabla: `files`

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,                   -- psd, ai, stl, obj, pdf
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 📁 Estructura de Directorios (Expandida)

```
grabarte.mx/
├── src/
│   ├── components/
│   │   ├── ProductCard.tsx         # Tarjeta de producto
│   │   ├── ProductGrid.tsx         # Grid de productos
│   │   ├── QuoteForm.tsx           # Formulario de cotización
│   │   ├── CategoryFilter.tsx      # Filtro por categoría
│   │   └── Header.tsx              # Encabezado
│   ├── pages/
│   │   ├── 404.tsx
│   │   ├── index.tsx               # Página principal
│   │   ├── catalog.tsx             # Catálogo completo
│   │   ├── products/
│   │   │   └── {product-id}.tsx    # Detalle de producto
│   │   └── contact.tsx             # Contacto
│   ├── styles/
│   │   ├── global.css              # Estilos globales
│   │   └── variables.css           # Variables CSS
│   ├── utils/
│   │   ├── api.ts                  # Llamadas a API
│   │   ├── types.ts                # Tipos compartidos
│   │   └── constants.ts            # Constantes
│   └── data/
│       └── products.json           # Datos de catálogo (si no usa DB)
│
├── .agents/
│   ├── instructions.md
│   ├── ARCHITECTURE.md             # Este archivo
│   └── workflows/
│       ├── check-style.md
│       ├── database.md             # (crear) Setup de BD
│       └── admin-panel.md          # (crear) Deploy panel admin
│
├── data/
│   ├── catalog.db                  # SQLite database
│   ├── uploads/                    # Archivos subidos
│   │   └── .gitkeep
│   └── backup/                     # Respaldos de BD
│       └── .gitkeep
│
├── scripts/
│   ├── init-db.js                  # (crear) Inicializar BD
│   ├── seed-db.js                  # (crear) Poblar datos de ejemplo
│   └── export-db.js                # (crear) Exportar datos
│
└── server/                         # (crear) Panel administrativo
    ├── index.js                    # Entrada del servidor
    ├── routes/
    │   ├── products.js             # CRUD de productos
    │   ├── categories.js           # CRUD de categorías
    │   ├── quotes.js               # Gestión de cotizaciones
    │   └── files.js                # Upload de archivos
    ├── controllers/
    │   ├── productController.js
    │   ├── categoryController.js
    │   ├── quoteController.js
    │   └── fileController.js
    ├── middleware/
    │   ├── auth.js                 # Autenticación
    │   └── errorHandler.js         # Manejo de errores
    ├── db/
    │   ├── connection.js           # Conexión SQLite
    │   └── queries.js              # Queries preparadas
    └── config/
        └── env.js                  # Configuración de entorno
```

---

## 🔌 API Endpoints (Panel Admin)

### Productos

```
GET    /api/products              # Listar todos
GET    /api/products/:id          # Obtener uno
POST   /api/products              # Crear
PUT    /api/products/:id          # Actualizar
DELETE /api/products/:id          # Eliminar
```

### Categorías

```
GET    /api/categories            # Listar todas
POST   /api/categories            # Crear
PUT    /api/categories/:id        # Actualizar
DELETE /api/categories/:id        # Eliminar
```

### Cotizaciones

```
GET    /api/quotes                # Listar todas
GET    /api/quotes/:id            # Obtener una
POST   /api/quotes                # Crear cotización
PUT    /api/quotes/:id            # Actualizar estado
```

### Upload de Archivos

```
POST   /api/files/upload          # Subir archivo
GET    /api/files/:productId      # Listar archivos del producto
DELETE /api/files/:fileId         # Eliminar archivo
```

---

## 🔄 Flujo de Datos

### 1. Cliente Explora Productos (Sitio Público)

```
[Cliente en localhost:8000]
    ↓
[Gatsby SSG carga catálogo]
    ↓
[React renderiza componentes]
    ↓
[Cliente ve productos + puede solicitar cotización]
```

### 2. Cliente Solicita Cotización

```
[Cliente llena formulario]
    ↓
[Envía datos a formulario de contacto]
    ↓
[Email o API guarda en BD]
    ↓
[Admin recibe notificación]
```

### 3. Admin Gestiona Catálogo (Desarrollo Local)

```
[Admin abre panel en localhost:3000]
    ↓
[Autentica (básico)]
    ↓
[CRUD de productos en SQLite]
    ↓
[Sube archivos fuente (.psd, .ai, etc.)]
    ↓
[Los datos se sincronizan con Gatsby]
    ↓
[Gatsby regenera sitio estático]
```

---

## 🚀 Configuración Inicial (Checklist)

### Paso 1: Crear Estructura de Directorios

```powershell
# Crea directorios necesarios
New-Item -ItemType Directory -Path "data/uploads" -Force
New-Item -ItemType Directory -Path "data/backup" -Force
New-Item -ItemType Directory -Path "scripts" -Force
New-Item -ItemType Directory -Path "server" -Force
```

### Paso 2: Inicializar Base de Datos

```powershell
# Crear archivo init-db.js en scripts/
node scripts/init-db.js

# Verificar que se creó ./data/catalog.db
Test-Path "data/catalog.db"
```

### Paso 3: Configurar Variables de Entorno

```env
# .env.local
GATSBY_ADMIN_ENABLED=true
GATSBY_DB_PATH=./data/catalog.db
GATSBY_API_URL=http://localhost:3000/api
GATSBY_UPLOAD_DIR=./data/uploads

# server/.env
DB_PATH=../data/catalog.db
UPLOAD_DIR=../data/uploads
PORT=3000
ADMIN_PASSWORD=tu_contraseña_temporal
```

### Paso 4: Iniciar Servicios

```powershell
# Terminal 1: Gatsby (frontend)
pnpm run develop

# Terminal 2: API Admin (backend)
cd server
npm start        # o node index.js
```

---

## 🔐 Seguridad

### Consideraciones Importantes

1. **Autenticación**: El panel admin debe estar protegido
   - Implementar JWT o sesiones
   - Cambiar contraseña por defecto

2. **Validación**: Todos los datos del cliente
   - Validar tipos en API
   - Sanitizar inputs
   - Revisar permisos en backend

3. **Archivos**: Upload de archivos seguro
   - Validar extensión permitida
   - Límite de tamaño
   - Scan de virus (si aplica)

4. **Backup**: Respaldo regular de BD
   ```powershell
   # scripts/backup-db.js
   cp data/catalog.db data/backup/catalog-$(date +%Y%m%d-%H%M%S).db
   ```

---

## 📈 Escalabilidad Futura

### Si el proyecto crece:

1. **Migrar SQLite a PostgreSQL** (aplicación más grande)
2. **Implementar CDN** para imágenes
3. **Agregar caché** (Redis)
4. **Desplegar en servidor** (Vercel, Netlify, AWS)
5. **Agregar pago** (Stripe, PayPal)
6. **Dashboard de analytics**

---

## 🛠️ Herramientas Recomendadas

### Desarrollo

- **VSCode** + extensiones:
  - ESLint
  - Prettier
  - Thunder Client (para probar API)
  - SQLite Explorer

### Testing

- **Jest**: Unit tests
- **Cypress**: E2E tests
- **Postman**: API testing

### Database

- **SQLite Studio**: GUI para SQLite
- **Dbeaver**: Cliente universal SQL

---

## 📚 Referencias

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización**: Julio 2026
**Arquitecto**: Equipo GrabArte
**Versión**: 1.0.0 (diseño)

