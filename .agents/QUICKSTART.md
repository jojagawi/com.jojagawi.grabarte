# QUICKSTART.md — Guía Rápida de GrabArte

**Bienvenido a GrabArte.** Esta es la guía rápida para empezar en 5 minutos.

---

## ⏱️ Setup Inicial (Primera Vez)

### 1. Clonar Repositorio

```powershell
git clone <repository-url>
cd grabarte.mx
```

### 2. Instalar Dependencias

```powershell
pnpm install
```

### 3. Iniciar Desarrollo

```powershell
pnpm run develop
```

**Abre en navegador**: http://localhost:8000 ✅

---

## 🎯 Comandos Principales

```powershell
pnpm run develop    # Iniciar servidor (hot reload)
pnpm run build      # Compilar para producción
pnpm run typecheck  # Verificar tipos TypeScript
pnpm run clean      # Limpiar caché
pnpm run serve      # Servir compilación local
```

---

## 📁 Dónde Agregar Código

### Agregar Nueva Página

Crea archivo en `src/pages/`:

```typescript
// src/pages/catalog.tsx
import React from 'react';

export default function CatalogPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Catálogo</h1>
      {/* Contenido aquí */}
    </div>
  );
}
```

✅ La página estará en: `/catalog`

### Agregar Nuevo Componente

Crea archivo en `src/components/`:

```typescript
// src/components/ProductCard.tsx
interface ProductCardProps {
  name: string;
  price: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ name, price }) => {
  return (
    <div className="border rounded p-4">
      <h3>{name}</h3>
      <p className="text-lg font-bold">${price}</p>
    </div>
  );
};
```

### Agregar Estilos

Usa **Tailwind CSS** directamente en componentes:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Contenido aquí
</div>
```

Si necesitas CSS global, edita `src/styles/global.css`.

---

## 📋 Checklist Antes de Commit

```powershell
# 1. Verifica tipos
pnpm run typecheck

# 2. Compila
pnpm run build

# 3. Si ambos pasan:
git add .
git commit -m "feat: descripción clara"
```

---

## 📚 Documentación Completa

- **Estándares de código**: Ver `.agents/instructions.md`
- **Arquitectura del proyecto**: Ver `.agents/ARCHITECTURE.md`
- **Setup de base de datos**: Ver `.agents/workflows/database.md`
- **Panel admin**: Ver `.agents/workflows/admin-panel.md`
- **Checklist de verificación**: Ver `.agents/workflows/check-style.md`

---

## 🆘 Problemas Comunes

### "Port 8000 already in use"

```powershell
taskkill /PID <PID> /F
gatsby develop -p 3000
```

### "Errores de TypeScript"

```powershell
pnpm run typecheck
# Corrige los errores mostrados
```

### "Gatsby cache corrupted"

```powershell
pnpm run clean
pnpm install
pnpm run develop
```

---

## 🚀 Proyecto GrabArte

**Qué es**: Catálogo de productos personalizados (termos, MDF, sellos, etc.)

**Dos partes**:
1. **Sitio público** (localhost:8000) - Catálogo de clientes
2. **Panel admin** (en desarrollo) - Gestión de productos y uploads

**Stack**: Gatsby + React + TypeScript + Tailwind CSS + SQLite

---

## 👨‍💻 Tu Primera Tarea

1. Abre `src/pages/index.tsx`
2. Edita el contenido
3. Verás los cambios en tiempo real en `localhost:8000`
4. Prueba: `pnpm run typecheck`
5. Listo para commit

---

¿Preguntas? Ver `.agents/instructions.md` para más detalles.

**¡Bienvenido al equipo GrabArte! 🎉**

