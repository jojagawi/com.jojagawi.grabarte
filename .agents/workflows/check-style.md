---
description: Verificar cumplimiento de estándares TypeScript y Gatsby
---

# Workflow: Verificación de Calidad de Código

Este workflow permite verificar que el código TypeScript y Gatsby cumple con los estándares del proyecto GrabArte.

## Checklist de Verificación

Antes de hacer commit, verifica:

### 1. Verificación de Tipos TypeScript

```powershell
pnpm run typecheck
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
pnpm run develop
# Abre en navegador y prueba con teclado (Tab, Enter, Space)
# Usa DevTools > Elements para verificar semántica
```

### 4. Verificación de Build

```powershell
pnpm run build
```

Verifica que la compilación de producción finaliza sin errores. Si hay warnings, evalúa si son críticos.

Ejemplo de output esperado:

```
success open and validate gatsby-config and load plugins - 0.127s
success load plugins - 0.893s
success onPreInit - 0.041s
...
success Building HTML for failed pages - 0.066s
success Clean up tmp files - 0.005s

Your build finished successfully ✓
```

### 5. Verificación de Imágenes

Todas las imágenes deben estar optimizadas:

- ✅ Imágenes en `src/images/` tienen dimensiones menores a 500KB
- ✅ Usa `gatsby-plugin-image` para optimización automática
- ✅ Soporta WebP fallback

Ejemplo correcto:

```typescript
import { StaticImage } from "gatsby-plugin-image";

export const Hero = () => (
  <StaticImage
    src="../images/hero-banner.jpg"
    alt="Catálogo de productos personalizados GrabArte"
  />
);
```

## Comando Rápido de Pre-Commit

Ejecuta todo antes de hacer commit:

```powershell
pnpm run typecheck; pnpm run build
```

Si ambos comandos finalizan sin errores, estás listo para hacer commit.

## Verificación en CI/CD

En GitHub Actions (si aplica), se ejecutarán estos checks automáticamente en PR. Asegúrate de que todos pasan antes de mergear.

---

**Última actualización**: Julio 2026
