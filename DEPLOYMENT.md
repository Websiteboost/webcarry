# 🚀 Guía de Deployment - WebCarry

## 📦 Preparación para Producción

### 1. Verificar Configuración

Antes de hacer el deployment, asegúrate de:

✅ Verificar que todas las imágenes estén en la carpeta `public/images/`
✅ Revisar que todos los enlaces en `config.md` sean correctos
✅ Probar el sitio localmente con `pnpm dev`
✅ Ejecutar el build con `pnpm build` y verificar que no haya errores

### 2. Build de Producción

```bash
# Limpiar build anterior (opcional)
rm -rf dist/ .astro/

# Construir para producción
pnpm build

# Previsualizar el build
pnpm preview
```

El build generará una carpeta `dist/` con todo el sitio optimizado.

## 🌐 Opciones de Deployment

### Opción 1: Vercel (Recomendado para SSR)

Vercel ofrece excelente soporte para Astro con SSR.

**Pasos:**

1. Instala el CLI de Vercel:
```bash
pnpm add -g vercel
```

2. Login a Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Para producción:
```bash
vercel --prod
```

**Configuración automática:** Vercel detectará automáticamente que es un proyecto Astro.

### Opción 2: Netlify

**Pasos:**

1. Crea un archivo `netlify.toml` en la raíz:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Instala el CLI de Netlify:
```bash
pnpm add -g netlify-cli
```

3. Login y deploy:
```bash
netlify login
netlify init
netlify deploy --prod
```

### Opción 3: VPS/Servidor Propio (Node.js)

Si tienes un servidor VPS con Node.js:

**Pasos:**

1. Asegúrate de tener Node.js 18+ instalado en el servidor

2. Clona el repositorio en el servidor:
```bash
git clone <tu-repo-url>
cd webcarry
```

3. Instala dependencias:
```bash
pnpm install
```

4. Build:
```bash
pnpm build
```

5. Inicia el servidor:
```bash
node dist/server/entry.mjs
```

**Para mantenerlo corriendo (con PM2):**

```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start dist/server/entry.mjs --name webcarry

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### Opción 4: Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build
RUN pnpm build

# Imagen de producción
FROM node:18-alpine
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar build y dependencias de producción
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
```

**Construir y ejecutar:**

```bash
# Construir imagen
docker build -t webcarry .

# Ejecutar contenedor
docker run -p 4321:4321 webcarry
```

### Opción 5: Railway.app

Railway ofrece deployment sencillo con Git.

**Pasos:**

1. Crea una cuenta en [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Railway detectará automáticamente el proyecto
4. Variables de entorno se configuran automáticamente
5. El sitio se deployará automáticamente en cada push

## 🔧 Variables de Entorno

Si necesitas variables de entorno en producción, créalas según la plataforma:

**Vercel/Netlify:**
```bash
# En el dashboard web de la plataforma
NODE_ENV=production
```

**VPS/Docker:**
```bash
# Archivo .env.production
NODE_ENV=production
PORT=4321
```

## 🔍 Verificación Post-Deployment

Después del deployment, verifica:

- [ ] El home carga correctamente
- [ ] Las tarjetas de juegos se muestran
- [ ] El clic en una tarjeta lleva a la página de servicios
- [ ] El menú de categorías funciona
- [ ] El menú hamburguesa funciona en móvil
- [ ] El sidebar de pago se abre correctamente
- [ ] Los botones de pago funcionan
- [ ] Las imágenes cargan (o muestran skeleton)
- [ ] El footer se muestra

## 📊 Monitoring y Analytics

### Agregar Google Analytics

1. Edita `src/layouts/MainLayout.astro`
2. Agrega el script de Google Analytics en el `<head>`:

```astro
<head>
  <!-- Contenido existente -->
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
</head>
```

### Logs del Servidor

Para ver logs en producción:

**PM2:**
```bash
pm2 logs webcarry
```

**Vercel:**
```bash
vercel logs
```

**Docker:**
```bash
docker logs <container-id>
```

## 🚨 Troubleshooting

### El sitio no carga

1. Verifica que el puerto 4321 esté disponible
2. Revisa los logs del servidor
3. Asegúrate de que todas las dependencias estén instaladas

### Las imágenes no cargan

1. Verifica que las imágenes estén en `public/images/`
2. Verifica las rutas en `config.md`
3. Asegúrate de que el servidor sirva archivos estáticos

### Error "Cannot find module"

1. Ejecuta `pnpm install` nuevamente
2. Elimina `node_modules/` y reinstala
3. Verifica que `pnpm-lock.yaml` esté en el repositorio

## 🔄 Actualizar el Sitio en Producción

### Con Git y plataforma automática (Vercel/Netlify/Railway)

```bash
# Hacer cambios en config.md o código
git add .
git commit -m "Actualizar contenido"
git push origin main
```

La plataforma se actualizará automáticamente.

### Con VPS/Servidor propio

```bash
# En el servidor
cd /path/to/webcarry
git pull origin main
pnpm install
pnpm build
pm2 restart webcarry
```

## 🔐 Seguridad

- Asegúrate de no exponer información sensible en `config.md`
- Mantén las dependencias actualizadas: `pnpm update`
- Usa HTTPS en producción (la mayoría de plataformas lo proveen gratis)

## 📈 Optimización

### Caché de Imágenes

Las imágenes en `public/` se sirven estáticamente. Considera usar un CDN para mejor rendimiento.

### Build Size

Para verificar el tamaño del build:

```bash
pnpm build
du -sh dist/
```

### Performance

Usa Lighthouse para analizar el rendimiento:

```bash
npm install -g lighthouse
lighthouse https://tu-sitio.com --view
```

## 🆘 Soporte

Para problemas de deployment, consulta:

- [Documentación de Astro - Deploy](https://docs.astro.build/en/guides/deploy/)
- [Astro Discord](https://astro.build/chat)
- Documentación específica de tu plataforma de hosting

---

**Nota:** Este proyecto usa SSR (Server-Side Rendering), así que necesitas una plataforma que soporte Node.js o serverless functions.
