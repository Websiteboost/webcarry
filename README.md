# WebCarry - Gaming Services Platform

Plataforma web para servicios gaming profesionales construida con Astro SSR, React, TypeScript y Tailwind CSS 4+.

## 🚀 Tecnologías

- **Astro v5.16.4** - Framework web con SSR
- **React v19.2.3** - Componentes de cliente interactivos
- **TypeScript** - Tipado estricto
- **Tailwind CSS v4.1.18** - Estilos con tema cyberpunk neón
- **pnpm** - Gestor de paquetes

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── astro/              # Componentes estáticos de Astro
│   │   ├── Footer.astro
│   │   ├── CategoryBadges.astro
│   │   └── Breadcrumb.astro
│   └── react/              # Componentes interactivos de React
│       ├── GameCards.tsx
│       ├── CategorySidebar.tsx
│       ├── ServiceGrid.tsx
│       ├── PaymentSidebar.tsx
│       └── MobileMenu.tsx
├── content/                # Configuración de contenido
│   ├── config.md           # Archivo editable con todos los textos
│   ├── categories/
│   └── services/
├── layouts/
│   └── MainLayout.astro    # Layout principal
├── pages/
│   ├── index.astro         # Página de inicio
│   └── game/
│       └── [id].astro      # Página de servicios por juego
├── styles/
│   └── global.css          # Estilos globales y tema cyberpunk
├── types/
│   └── index.ts            # Tipos TypeScript
└── utils/
    └── content-parser.ts   # Parser del archivo config.md
```

## 🎨 Características del Diseño

### Tema Cyberpunk Neón
- Paleta de colores: Morado oscuro, azul, verde, rosa y blanco
- Efectos de neón y glow
- Degradados y glassmorphism
- Patrones de fondo gaming

### Páginas Implementadas

#### 1. Home (`/`)
- Título y subtítulo con efectos neón
- Badges de categorías destacadas
- Grid de 4 tarjetas de juegos con loading skeleton
- Footer con iconos de métodos de pago (PayPal, Visa/Mastercard)
- Responsive: 1 columna en móvil, 2 en tablet, 4 en desktop

#### 2. Página de Servicios (`/game/[id]`)
- Menú lateral de categorías desplegables (desktop)
- Menú hamburguesa (móvil)
- Breadcrumb de navegación
- Grid de tarjetas de servicios (3 por fila en desktop, 1 en móvil)
- Cada servicio incluye:
  - Imagen con degradado
  - Título
  - Lista de características (3 puntos)
  - Precio en USD
  - Botón de compra
- Fondo con marcas de agua de personajes gaming

#### 3. Sidebar de Pago
- Se desliza de derecha a izquierda
- Vista previa del servicio con imagen
- Selector de región (EU/US)
- Opciones de precio predefinidas ($5, $10, $20, $50)
- Campo para precio personalizado
- Checkbox de aceptación de políticas
- Botones de métodos de pago (PayPal y Tarjeta)
- Total y botón de pago

## 📝 Configuración de Contenido

Todo el contenido se gestiona desde archivos Markdown en `src/content/`. Estos archivos permiten:

- ✅ Editar textos del home (título, subtítulo, categorías)
- ✅ Agregar/editar/eliminar juegos
- ✅ Agregar/editar/eliminar categorías de servicios
- ✅ Agregar/editar/eliminar servicios individuales
- ✅ Configurar precios (fijos, barras, boxes, custom, selectors)
- ✅ URLs de imágenes

### Vinculación Juego-Servicio

Los servicios pueden vincularse a juegos específicos usando el campo `**Games**`:

```markdown
## Heroic Full Clear
- **ID**: rc-2
- **Title**: Heroic Full Clear
- **Category**: raid-completion
- **Games**: game-1, game-3  # ← Solo aparece en estos juegos
- **Price**: 80
```

- Si no se especifica `**Games**`, el servicio aparece en **todos** los juegos
- Para múltiples juegos, separa los IDs con comas: `game-1, game-2, game-3`
- Esto permite mostrar servicios relevantes por tipo de juego (MMO, MOBA, FPS, RPG)

### Tipos de Precios Disponibles

```markdown
# Precio con barra deslizable
- **BarPrice**:
  - InitValue: 1
  - FinalValue: 50
  - Step: 1
  - Label: Select Level

# Precio con opciones predefinidas
- **BoxPrice**:
  - Basic: 10
  - Standard: 20
  - Premium: 45

# Precio personalizable
- **CustomPrice**:
  - Label: Enter Amount
  - Presets:
    - 10
    - 25
    - 50

# Selectores con precio adicional
- **Selectors**:
  - Raid Group Size:
    - 10 Players: 0
    - 15 Players: 45
    - 20 Players: 80
```

## 🚀 Comandos

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar build de producción
pnpm preview
```

## 🌐 SSR (Server-Side Rendering)

El proyecto está configurado con SSR usando `@astrojs/node` en modo standalone:

- Renderizado del lado del servidor para mejor SEO
- Componentes React con hidratación (`client:load`)
- Rutas dinámicas generadas estáticamente en build time

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (1 columna)
- **Tablet**: 640px - 1024px (2 columnas)
- **Desktop**: > 1024px (3-4 columnas)

### Características Mobile
- Menú hamburguesa para categorías
- Sidebars deslizables
- Ajuste de tipografías
- Optimización de imágenes skeleton

## 🎯 Componentes React Asíncronos

Todos los componentes React implementan loading skeleton:

1. Estado de carga inicial
2. Skeleton con animación de shimmer
3. Carga de datos simulada (setTimeout)
4. Renderizado final con datos reales

## 🎨 Clases CSS Personalizadas

- `.neon-text` - Efecto de texto neón
- `.neon-border` - Borde con efecto neón
- `.neon-glow` - Glow effect
- `.neon-pulse` - Animación de pulso
- `.skeleton` - Loading skeleton animado
- `.glass-effect` - Glassmorphism
- `.card-hover` - Efecto hover para tarjetas

## 🔧 Validaciones

Todos los componentes validan datos antes de renderizar:
- Verificación de arrays vacíos
- Validación de props requeridas
- Fallbacks para contenido faltante

## 📄 Licencia

Proyecto creado para AzanoRivers © 2026
