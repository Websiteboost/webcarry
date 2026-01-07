# ⚡ Quick Start - WebCarry

## 🚀 Inicio Rápido

### 1. Instalar Dependencias (si no lo has hecho)
```bash
cd c:\DevCode\Repositories\Webcarry
pnpm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
pnpm dev
```

**Abre en tu navegador:** http://localhost:4321

### 3. Ver las Páginas

- **Home**: http://localhost:4321/
- **Servicios (ejemplo)**: http://localhost:4321/game/game-1
- **Más juegos**: Cambia `game-1` por `game-2`, `game-3`, etc.

## ✏️ Editar Contenido

1. Abre el archivo: `src/content/config.md`
2. Edita los textos que quieras cambiar
3. Guarda el archivo
4. Recarga el navegador

**Para más detalles:** Lee [GUIA-EDICION-CONTENIDO.md](GUIA-EDICION-CONTENIDO.md)

## 📸 Agregar Imágenes

1. Coloca tus imágenes en:
   - `public/images/games/` para juegos
   - `public/images/services/` para servicios

2. Actualiza las rutas en `config.md`:
```markdown
- **Imagen**: /images/games/tu-imagen.jpg
```

## 🎨 Características Principales

### Home
- ✅ Título y subtítulo con neón
- ✅ 4 tarjetas de juegos
- ✅ Badges de categorías
- ✅ Footer con métodos de pago

### Página de Servicios
- ✅ Menú lateral de categorías (desktop)
- ✅ Menú hamburguesa (mobile)
- ✅ Grid de tarjetas de servicios
- ✅ Click en "Comprar" abre el sidebar

### Sidebar de Pago
- ✅ Selección de región (EU/US)
- ✅ Precios predefinidos o personalizados
- ✅ Métodos de pago (PayPal/Tarjeta)
- ✅ Validación de políticas

## 📱 Testing Responsive

### En tu navegador:
1. Abre DevTools (F12)
2. Click en el icono de dispositivo móvil
3. Prueba diferentes tamaños:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1280px

### En mobile real:
1. Ejecuta: `pnpm dev --host`
2. Abre la URL de red en tu móvil

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Previsualizar build
pnpm preview

# Verificar tipos TypeScript
pnpm astro check

# Actualizar dependencias
pnpm update
```

## 📖 Documentación Completa

- **README.md** - Visión general del proyecto
- **GUIA-EDICION-CONTENIDO.md** - Cómo editar contenido (para clientes)
- **DEPLOYMENT.md** - Cómo hacer deployment
- **PROYECTO-COMPLETADO.md** - Checklist completo

## 🎯 Próximos Pasos Recomendados

1. **Agregar tus imágenes reales** en `public/images/`
2. **Editar el contenido** en `src/content/config.md` con tus datos
3. **Probar en móvil** para verificar responsive
4. **Hacer build** con `pnpm build`
5. **Deployar** siguiendo [DEPLOYMENT.md](DEPLOYMENT.md)

## ⚠️ Notas Importantes

- El archivo `config.md` es la única fuente de datos
- Las carpetas `categories/` y `services/` están vacías por diseño
- Los warnings sobre "No files found" son normales
- Las imágenes actualmente muestran skeleton (loading)

## 🆘 Problemas Comunes

### El servidor no inicia
```bash
# Limpia caché y reinstala
rm -rf node_modules/ .astro/
pnpm install
pnpm dev
```

### Los cambios no se reflejan
1. Detén el servidor (Ctrl+C)
2. Inicia nuevamente: `pnpm dev`
3. Limpia caché del navegador (Ctrl+Shift+R)

### Error de TypeScript
```bash
pnpm astro check
```
Esto mostrará los errores específicos.

## 💡 Tips

- **Hot Reload**: Los cambios se aplican automáticamente
- **Logs**: Revisa la consola del navegador (F12) para errores
- **Terminal**: Mantén un ojo en los logs del servidor
- **Git**: Haz commits frecuentes de tus cambios

## 🎮 ¡Disfruta Desarrollando!

El proyecto está listo para usar. Explora, edita y personaliza según necesites.

**¿Preguntas?** Consulta la documentación completa en los archivos MD de la raíz.
