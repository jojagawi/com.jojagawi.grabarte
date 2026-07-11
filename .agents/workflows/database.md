---
description: Setup y gestión de base de datos SQLite para GrabArte
---

# Workflow: Database Setup y Gestión

Este workflow describe cómo configurar, inicializar y gestionar la base de datos SQLite de GrabArte.

---

## 📋 Checklist: Primero Setup (One-time)

Ejecuta esto UNA SOLA VEZ al iniciar el proyecto:

### 1. Crear Estructura de Directorios

```powershell
# PowerShell
New-Item -ItemType Directory -Path "data/uploads" -Force
New-Item -ItemType Directory -Path "data/backup" -Force
New-Item -ItemType Directory -Path "scripts" -Force

# Verifica que se crearon
Get-ChildItem -Recurse "data"
```

### 2. Crear Archivo de Inicialización de BD

Crea `scripts/init-db.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catalog.db');

// Asegúrate de que el directorio existe
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Tabla: Categorías
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      icon_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla: Productos
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      description TEXT,
      price_base REAL DEFAULT 0,
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      customization_options TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Tabla: Opciones de Personalización
  db.run(`
    CREATE TABLE IF NOT EXISTS customization_options (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      values TEXT NOT NULL,
      price_modifier REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Tabla: Cotizaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      product_id TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      customization_details TEXT,
      estimated_total REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Tabla: Archivos Subidos
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      uploaded_by TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tables:', err);
    } else {
      console.log('✅ Database initialized successfully at:', dbPath);
    }
    db.close();
  });
});
```

### 3. Instalar Driver de SQLite

```powershell
pnpm add sqlite3 -D
# o
npm install sqlite3 --save-dev
```

### 4. Ejecutar Inicialización

```powershell
node scripts/init-db.js
# Output: ✅ Database initialized successfully at: J:\grabarte.mx\data\catalog.db
```

### 5. Verificar que se Creó la BD

```powershell
# Verifica que el archivo existe
Test-Path "data/catalog.db"
# Output: True

# Verifica el tamaño
(Get-Item "data/catalog.db").Length
# Output: ~5120 bytes (tamaño inicial)
```

---

## 📊 Checklist: Después del Setup

### Operaciones Comunes

#### Insertar Datos de Ejemplo

Crea `scripts/seed-db.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/catalog.db');
const db = new sqlite3.Database(dbPath);

const categories = [
  { id: 'cat_1', name: 'Termos', description: 'Termos personalizados' },
  { id: 'cat_2', name: 'MDF', description: 'Productos de MDF' },
  { id: 'cat_3', name: 'Sellos', description: 'Sellos personalizados' },
  { id: 'cat_4', name: 'Acrílico', description: 'Artículos de acrílico' },
  { id: 'cat_5', name: 'Cuero', description: 'Productos de cuero' },
  { id: 'cat_6', name: 'Figuras 3D', description: 'Figuras y objetos 3D' }
];

const products = [
  {
    id: 'prod_1',
    name: 'Termo Sport',
    category_id: 'cat_1',
    description: 'Termo deportivo personalizable',
    price_base: 450,
    image_url: '/images/termo-sport.jpg'
  }
];

db.serialize(() => {
  categories.forEach(cat => {
    db.run(
      `INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`,
      [cat.id, cat.name, cat.description]
    );
  });

  products.forEach(prod => {
    db.run(
      `INSERT OR IGNORE INTO products (id, name, category_id, description, price_base, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prod.id, prod.name, prod.category_id, prod.description, prod.price_base, prod.image_url]
    );
  });

  console.log('✅ Seed data inserted');
  db.close();
});
```

Ejecuta:

```powershell
node scripts/seed-db.js
```

#### Exportar Datos

```powershell
# Respalda la BD
Copy-Item "data/catalog.db" "data/backup/catalog-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').db"

# Verifica el respaldo
Get-ChildItem "data/backup/"
```

#### Limpiar y Reiniciar BD

```powershell
# ⚠️ ADVERTENCIA: Esto borra todos los datos

# 1. Borra el archivo
Remove-Item "data/catalog.db"

# 2. Reinicializa
node scripts/init-db.js

# 3. Siembra con datos de ejemplo (opcional)
node scripts/seed-db.js
```

---

## 🔍 Verificar Datos en BD

### Usando SQLite CLI

```powershell
# Abre el shell de SQLite
sqlite3 data/catalog.db

# Dentro del shell:
.tables                    # Listar tablas
SELECT * FROM products;    # Ver productos
SELECT * FROM categories;  # Ver categorías
.quit                      # Salir
```

### Usando SQLite Browser

Instala [SQLite Browser](https://sqlitebrowser.org/) y abre `data/catalog.db` gráficamente.

---

## 🔄 Flujo de Trabajo Local

### Desarrollo Diario

```powershell
# Terminal 1: Gatsby (frontend)
pnpm run develop

# Terminal 2: (Opcional) Monitorear cambios de BD
# Puedes usar SQLite Browser o scripts de watch

# Terminal 3: (Próximo) API Admin
# cd server && npm start
```

### Agregar Nuevo Producto (Simulado)

```powershell
# Opción 1: Por Script
node scripts/add-product.js --name "Termo Deluxe" --category "termos" --price 650

# Opción 2: Directamente en SQLite
sqlite3 data/catalog.db
INSERT INTO products (id, name, category_id, description, price_base)
VALUES ('prod_2', 'Termo Deluxe', 'cat_1', 'Premium thermal bottle', 650);
.quit

# Opción 3: (Próximo) A través del panel admin
# POST http://localhost:3000/api/products
```

---

## 📝 Queries Útiles

### Obtener todos los productos de una categoría

```sql
SELECT p.* FROM products p
WHERE p.category_id = 'cat_1'
AND p.is_active = 1
ORDER BY p.created_at DESC;
```

### Obtener cotizaciones pendientes

```sql
SELECT * FROM quotes
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Estadísticas de productos

```sql
SELECT
  c.name as category,
  COUNT(p.id) as total_products,
  AVG(p.price_base) as avg_price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = 1
GROUP BY c.id;
```

### Listar archivos subidos

```sql
SELECT f.filename, f.file_type, f.uploaded_at
FROM files f
WHERE f.product_id = 'prod_1'
ORDER BY f.uploaded_at DESC;
```

---

## ⚠️ Troubleshooting

### "SQLITE_CANTOPEN: unable to open database file"

```powershell
# Problema: El directorio no existe o permisos de escritura

# Solución:
New-Item -ItemType Directory -Path "data" -Force
node scripts/init-db.js
```

### "database table already exists"

```powershell
# Problema: La tabla ya existe (si re-ejecutas init-db.js)

# Solución: Es seguro, usa CREATE TABLE IF NOT EXISTS
# Ya está en el script

# O limpia y reinicia:
Remove-Item "data/catalog.db"
node scripts/init-db.js
```

### "FOREIGN KEY constraint failed"

```powershell
# Problema: Intentaste insertar un producto sin categoría válida

# Solución:
# 1. Verifica que la categoría existe:
sqlite3 data/catalog.db "SELECT id FROM categories;"

# 2. Inserta con categoría válida:
sqlite3 data/catalog.db \
  "INSERT INTO products (id, name, category_id, price_base) VALUES ('prod_3', 'Test', 'cat_1', 500);"
```

### Los cambios en BD no se reflejan en Gatsby

```powershell
# Problema: Gatsby cacheó los datos

# Solución:
pnpm run clean
pnpm run develop
```

---

## 🚀 Preparación para Panel Admin

Una vez tengas la BD funcionando localmente:

1. **Crear API REST** en `server/index.js` (Express)
2. **Endpoints CRUD** en `server/routes/products.js`
3. **Autenticación** en `server/middleware/auth.js`
4. **Upload de archivos** en `server/routes/files.js`

Ver `ARCHITECTURE.md` para detalles.

---

## 📚 Referencias

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [node-sqlite3 Module](https://github.com/TryGhost/node-sqlite3)
- [SQLite Browser App](https://sqlitebrowser.org/)

---

**Última actualización**: Julio 2026
**Mantenedor**: Equipo GrabArte

