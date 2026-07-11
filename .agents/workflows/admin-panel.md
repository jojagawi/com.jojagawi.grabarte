---
description: Setup e implementación del panel administrativo de GrabArte
---

# Workflow: Admin Panel Setup

Este workflow describe cómo configurar e implementar el panel administrativo local para gestión de catálogo con SQLite.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de:

- ✅ Gatsby funcionando: `pnpm run develop` (puerto 8000)
- ✅ Base de datos iniciada: `node scripts/init-db.js` ✅ Node.js >= 24.0.0

---

## 🚀 Paso 1: Crear Estructura del Servidor

### Crear Directorio del Servidor

```powershell
# Crea la estructura
New-Item -ItemType Directory -Path "server" -Force
New-Item -ItemType Directory -Path "server/routes" -Force
New-Item -ItemType Directory -Path "server/controllers" -Force
New-Item -ItemType Directory -Path "server/middleware" -Force
New-Item -ItemType Directory -Path "server/db" -Force
New-Item -ItemType Directory -Path "server/config" -Force

# Verifica
Get-ChildItem -Recurse "server"
```

### Crear package.json del Servidor

Crea `server/package.json`:

```json
{
  "name": "grabarte-admin-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "seed": "node scripts/seed-db.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 📦 Paso 2: Instalar Dependencias

```powershell
# En el directorio raíz
cd server

# Instala las dependencias
npm install
# o
pnpm install

# Para desarrollo (hot reload)
npm install -D nodemon
# o
pnpm add -D nodemon

# Regresa a la raíz
cd ..
```

---

## 🔧 Paso 3: Crear Archivos de Configuración

### Configuración de Entorno

Crea `server/.env`:

```env
PORT=3000
NODE_ENV=development
DB_PATH=../data/catalog.db
UPLOAD_DIR=../data/uploads
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:8000
```

### Configuración de Entorno (Lectura)

Crea `server/config/env.js`:

```javascript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || '../data/catalog.db',
  uploadDir: process.env.UPLOAD_DIR || '../data/uploads',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8000'
};
```

---

## 🗄️ Paso 4: Conexión a Base de Datos

Crea `server/db/connection.js`:

```javascript
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.resolve(__dirname, config.dbPath);

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log(`✅ Connected to SQLite at: ${dbPath}`);
        db.run('PRAGMA foreign_keys = ON'); // Habilita claves foráneas
        resolve(db);
      }
    });
  });
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// Helpers para ejecutar queries
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
```

---

## 🛡️ Paso 5: Middleware de Autenticación

Crea `server/middleware/auth.js`:

```javascript
import { config } from '../config/env.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  const password = req.headers['x-admin-password'];

  // Verificación básica (en producción, usar JWT)
  if (!token && !password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (password && password !== config.adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
};
```

---

## 🏗️ Paso 6: Controladores y Rutas

### Controlador de Productos

Crea `server/controllers/productController.js`:

```javascript
import { v4 as uuid } from 'uuid';
import { dbAll, dbGet, dbRun } from '../db/connection.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category_id, description, price_base, image_url } = req.body;
    const id = `prod_${uuid()}`;

    await dbRun(
      `INSERT INTO products (id, name, category_id, description, price_base, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, category_id, description, price_base, image_url]
    );

    res.status(201).json({ id, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description, price_base, image_url, is_active } = req.body;

    await dbRun(
      `UPDATE products SET name=?, category_id=?, description=?, price_base=?, image_url=?, is_active=?, updated_at=CURRENT_TIMESTAMP
       WHERE id=?`,
      [name, category_id, description, price_base, image_url, is_active, id]
    );

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await dbRun('DELETE FROM products WHERE id=?', [id]);

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Rutas de Productos

Crea `server/routes/products.js`:

```javascript
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
```

---

## 🚀 Paso 7: Servidor Principal

Crea `server/index.js`:

```javascript
import express from 'express';
import cors from 'cors';
import { initDB } from './db/connection.js';
import { config } from './config/env.js';
import { authMiddleware, errorHandler } from './middleware/auth.js';
import productRoutes from './routes/products.js';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(authMiddleware);

// Rutas
app.use('/api/products', productRoutes);

// Salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
initDB().then(() => {
  app.listen(config.port, () => {
    console.log(`✅ Admin API running at http://localhost:${config.port}`);
    console.log(`📊 Database: ${config.dbPath}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
```

---

## ▶️ Paso 8: Iniciar el Panel Admin

### Terminal 1: Gatsby (Frontend)

```powershell
# En la raíz del proyecto
pnpm run develop

# Accede a: http://localhost:8000
```

### Terminal 2: API Admin (Backend)

```powershell
# En el directorio server/
cd server
npm start

# Output:
# ✅ Admin API running at http://localhost:3000
# ✅ Connected to SQLite at: ...
```

---

## 🧪 Prueba de API

### Verificar Salud

```powershell
# PowerShell
$headers = @{ "x-admin-password" = "admin123" }
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Headers $headers -Method Get

# cURL (si tienes Git Bash o WSL)
curl -H "x-admin-password: admin123" http://localhost:3000/api/health
```

### Obtener Productos

```powershell
$headers = @{ "x-admin-password" = "admin123" }
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Headers $headers -Method Get
$response.Content | ConvertFrom-Json
```

### Crear Producto

```powershell
$headers = @{ "x-admin-password" = "admin123" }
$body = @{
  name = "Termo Premium"
  category_id = "cat_1"
  description = "Termo de lujo personalizable"
  price_base = 600
  image_url = "/images/termo-premium.jpg"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/products" `
  -Headers $headers `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

---

## 🎯 Siguientes Pasos

### Fase 1: Core (Lo que acabamos de hacer)
- ✅ Setup servidor Express
- ✅ Conexión SQLite
- ✅ Autenticación básica
- ✅ CRUD de productos

### Fase 2: Extensión
- 🔲 Upload de archivos (Multer)
- 🔲 CRUD de categorías
- 🔲 Gestión de cotizaciones
- 🔲 Dashboard de estadísticas

### Fase 3: Frontend Admin
- 🔲 Interfaz React para gestión
- 🔲 Formularios de productos
- 🔲 Upload de archivos
- 🔲 Tablas de datos

---

## ⚠️ Troubleshooting

### "Port 3000 already in use"

```powershell
# Encuentra el proceso
netstat -ano | findstr :3000

# Mata el proceso
taskkill /PID <PID> /F

# O usa un puerto diferente
PORT=3001 npm start
```

### "Cannot find module 'express'"

```powershell
cd server
npm install
# o
pnpm install
```

### "Unauthorized" en API calls

```powershell
# Asegúrate de incluir el header
# -H "x-admin-password: admin123"
# en requests

# Verifica la contraseña en server/.env
```

### "Database not initialized"

```powershell
# En la raíz, ejecuta:
node scripts/init-db.js

# Luego reinicia el servidor
```

---

## 🔐 Seguridad en Producción

Antes de ir a producción:

1. **JWT**: Cambia de contraseña simple a JWT
2. **HTTPS**: Usa certificados SSL/TLS
3. **Rate limiting**: Agrega protección contra bots
4. **Validación**: Valida todas las entradas
5. **Database**: Usa PostgreSQL en lugar de SQLite
6. **Autenticación**: Implementa OAuth2 o similar

---

## 📚 Estructura Final

```
grabarte.mx/
├── server/
│   ├── index.js                    # Entrada principal
│   ├── package.json
│   ├── .env
│   ├── routes/
│   │   ├── products.js
│   │   ├── categories.js (próximo)
│   │   ├── quotes.js (próximo)
│   │   └── files.js (próximo)
│   ├── controllers/
│   │   └── productController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db/
│   │   └── connection.js
│   └── config/
│       └── env.js
├── scripts/
│   ├── init-db.js
│   └── seed-db.js
└── ... (resto de Gatsby)
```

---

**Última actualización**: Julio 2026
**Mantenedor**: Equipo GrabArte
**Versión**: 1.0.0 (básico)

