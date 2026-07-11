# INDEX.md — Índice de Referencia para Agentes

Guía de navegación rápida de toda la documentación de GrabArte.

---

## 📖 Documentación Principal

### Para Empezar
- **[QUICKSTART.md](./QUICKSTART.md)** - Guía rápida (5 minutos)
- **[../README.md](../README.md)** - Documentación completa del proyecto

### Desarrollo
- **[instructions.md](./instructions.md)** - Estándares de código y convenciones
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura técnica completa

---

## 🔧 Workflows (Paso a Paso)

### Setup Inicial
1. **[QUICKSTART.md](./QUICKSTART.md)** - Instalar y ejecutar
2. **[workflows/database.md](./workflows/database.md)** - Configurar SQLite

### Verificación de Calidad
- **[workflows/check-style.md](./workflows/check-style.md)** - TypeScript, accesibilidad, build

### Panel Administrativo
- **[workflows/admin-panel.md](./workflows/admin-panel.md)** - Setup del servidor Express

---

## 🎯 Resumen Rápido

### Comandos Esenciales

```powershell
pnpm install        # Instalar dependencias
pnpm run develop    # Iniciar servidor de desarrollo
pnpm run typecheck  # Verificar tipos
pnpm run build      # Compilar para producción
pnpm run clean      # Limpiar caché
```

### Estructura de Directorios

```
src/
├── pages/          # Páginas (crean rutas automáticamente)
├── components/     # Componentes React reutilizables
├── styles/         # Estilos globales
├── utils/          # Funciones utilitarias
├── images/         # Imágenes optimizadas
└── data/           # Datos estáticos (si aplica)

.agents/
├── QUICKSTART.md   # Inicio rápido
├── instructions.md # Estándares
├── ARCHITECTURE.md # Arquitectura
└── workflows/      # Procedimientos
    ├── check-style.md    # QA
    ├── database.md       # Base de datos
    └── admin-panel.md    # Panel admin
```

---

## ⚡ Tareas Comunes

### Crear Nueva Página

1. Crea archivo en `src/pages/mi-pagina.tsx`
2. Exporta componente default
3. Automáticamente disponible en `/mi-pagina`
4. Ver [instructions.md](./instructions.md#componentes-react)

### Crear Nuevo Componente

1. Crea carpeta en `src/components/MiComponente/`
2. Crea archivo `MiComponente.tsx`
3. Define tipos con `interface PropsType`
4. Ver [instructions.md](./instructions.md#componentes-react)

### Agregar Estilos

- Usa **Tailwind CSS** en clases
- Define variables en `src/styles/global.css`
- Evita mezclar CSS global innecesario
- Ver [instructions.md](./instructions.md#estilos-con-tailwindcss)

### Verificar Calidad de Código

```powershell
pnpm run typecheck    # Errores de tipo
pnpm run build        # Build completo
```

---

## 🔐 Seguridad

- ❌ Nunca commitees `.env.local`
- ❌ Nunca commitees secretos o credenciales
- ✅ Usa `.env.local` para desarrollo
- ✅ Revisa dependencias nuevas con `pnpm audit`

Ver [instructions.md](./instructions.md#notas-de-seguridad)

---

## 🗄️ Base de Datos (SQLite)

### Setup Inicial
```powershell
node scripts/init-db.js
```

### Archivos Importantes
- `data/catalog.db` - Base de datos
- `scripts/init-db.js` - Inicialización
- `scripts/seed-db.js` - Datos de ejemplo

Ver [workflows/database.md](./workflows/database.md)

---

## 🛠️ Panel Administrativo

### Estructura
- `server/` - API Express
- `server/routes/` - Endpoints
- `server/controllers/` - Lógica
- `server/db/` - Conexión SQLite

### Iniciar
```powershell
cd server
npm start
# http://localhost:3000
```

Ver [workflows/admin-panel.md](./workflows/admin-panel.md)

---

## 📊 Stack Tecnológico

| Herramienta | Propósito |
|-----------|----------|
| Gatsby 5 | Framework SSG |
| React 18 | Componentes UI |
| TypeScript | Seguridad de tipos |
| Tailwind CSS | Estilos |
| SQLite | Base de datos |
| Express | API (panel admin) |

---

## 🚀 Antes de Hacer Commit

**Checklist obligatorio:**

```powershell
pnpm run typecheck    # ✅ Sin errores
pnpm run build        # ✅ Build exitoso
git commit -m "feat: descripción"
```

Ver [workflows/check-style.md](./workflows/check-style.md)

---

## 📞 Preguntas Frecuentes

### "¿Por dónde empiezo?"
→ Lee [QUICKSTART.md](./QUICKSTART.md)

### "¿Cómo agrego una página?"
→ Crea archivo en `src/pages/`

### "¿Cuáles son los estándares de código?"
→ Lee [instructions.md](./instructions.md)

### "¿Cómo configuro SQLite?"
→ Ver [workflows/database.md](./workflows/database.md)

### "¿Cómo inicio el panel admin?"
→ Ver [workflows/admin-panel.md](./workflows/admin-panel.md)

### "¿Qué hago si hay error de TypeScript?"
→ Ejecuta `pnpm run typecheck` y corrige

---

## 🔗 Enlaces Útiles

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SQLite Docs](https://www.sqlite.org/docs.html)

---

## 📝 Archivo de Referencia Rápida

```
.agents/
├── INDEX.md              # Este archivo
├── QUICKSTART.md         # Empezar en 5 min
├── instructions.md       # Estándares
├── ARCHITECTURE.md       # Arquitectura
└── workflows/
    ├── check-style.md    # QA checklist
    ├── database.md       # SQLite setup
    └── admin-panel.md    # Panel admin
```

---

**Última actualización**: Julio 2026
**Proyecto**: GrabArte - Catálogo de Productos Personalizados
**Stack**: Gatsby + React + TypeScript + Tailwind CSS + SQLite

