---
description: Verificar cumplimiento de estándares TypeScript y Next.js App Router
---

# Workflow: Verificación de Calidad de Código

Este workflow valida que el codigo cumpla los estandares del proyecto en la arquitectura actual con Next.js.

## Checklist de Verificación

Antes de hacer commit, verifica:

### 1. Verificación de Tipos TypeScript

```powershell
pnpm run test:typecheck
```

Esto ejecuta `tsc --noEmit` y reporta cualquier error de tipo. **Corrige todos los errores antes de mergear.**

Ejemplo de error común:

```typescript
// ❌ Incorrecto: Type 'any'
const data: any = fetchData();

// ✅ Correcto: Type explícito
interface Product {
  id: string;
  name: string;
  price: number;
}
const data: Product = fetchData();
```

### 2. Verificación de Estructura de Componentes

Usa este checklist para cada componente nuevo:

- ✅ Archivo nombrado en `PascalCase` (ej: `ProductCard.tsx`)
- ✅ Componente exportado como named export
- ✅ Props definidas con interface/type
- ✅ Incluye `alt` en todas las imágenes
- ✅ Usa clases de Tailwind para estilos
- ✅ Sin `any` en TypeScript
- ✅ JSDoc para props complejas (opcional pero recomendado)

### 3. Verificación de Accesibilidad

Para cada página o componente principal:

- ✅ Jerarquía correcta de headings (`<h1>` → `<h2>` → etc.)
- ✅ Botones y links semánticamente correctos
- ✅ Images tienen `alt` descriptivo
- ✅ Forms tiene labels asociados
- ✅ Colores tienen suficiente contraste (WCAG AA mínimo)

Prueba manualmente con:

```powershell
pnpm run dev
# Abre en navegador y prueba con teclado (Tab, Enter, Space)
# Usa DevTools > Elements para verificar semántica
```

### 4. Verificación de Build

```powershell
pnpm run build
```

Verifica que la compilación de producción finaliza sin errores. Si hay warnings, evalúa si son críticos.

Validaciones esperadas después del build:

```
- Build finalizado sin errores fatales
- Carpeta `out/` generada
- Si aplica, assets y rutas estaticas correctas para deploy
```

### 5. Verificación de Imágenes

Todas las imágenes deben estar optimizadas:

- ✅ Imágenes en `public/` con peso optimizado para web
- ✅ `alt` descriptivo en imágenes renderizadas
- ✅ Uso correcto de `next/image` cuando aplique
- ✅ Compatible con export estático (`images.unoptimized: true`)

Ejemplo correcto:

```tsx
import Image from "next/image";

export function HeroImage() {
  return (
    <Image
      src="/images/hero-banner.jpg"
      alt="Catalogo de productos personalizados GrabArte"
      width={1600}
      height={900}
      priority
    />
  );
}
```

## Comando Rápido de Pre-Commit

Ejecuta todo antes de hacer commit:

```powershell
pnpm run test:all
pnpm run build
```

Opcional segun alcance de cambios:

```powershell
pnpm run test:lighthouse
```

Si los comandos relevantes finalizan sin errores, estas listo para hacer commit.

## Verificación en CI/CD

En CI (si aplica), se recomienda ejecutar al menos `pnpm run ci` antes de mergear.

---

**Última actualización**: Julio 2026
