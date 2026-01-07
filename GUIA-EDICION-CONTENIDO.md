# 📖 Guía para Editar Contenido - WebCarry

## 🎯 Ubicación del Archivo de Configuración

Todo el contenido de tu sitio web se gestiona desde un único archivo:

**`src/content/config.md`**

Este archivo contiene todos los textos, categorías, servicios, precios e imágenes de tu sitio.

## ✏️ Cómo Editar el Contenido

### 1. Editar el Título y Subtítulo del Home

Busca la sección **"## Información del Home"** y edita:

```markdown
### Título Principal
Tu Nuevo Título Aquí

### Subtítulo
Tu nuevo subtítulo aquí
```

### 2. Editar las Categorías Destacadas

En la misma sección, bajo **"### Categorías Destacadas"**, puedes:

**Agregar una categoría:**
```markdown
- Nueva Categoría
```

**Eliminar una categoría:**
Simplemente borra la línea completa.

**Editar una categoría:**
Cambia el texto de la línea.

### 3. Agregar un Nuevo Juego

Busca la sección **"## Juegos Disponibles"** y agrega:

```markdown
### Juego 5
- **ID**: game-5
- **Título**: Nombre del Juego
- **Categoría**: Tipo de Juego
- **Imagen**: /images/games/nombre-imagen.jpg
```

**Importante:**
- El **ID** debe ser único y sin espacios (usa guiones)
- La **Imagen** debe estar en la carpeta `public/images/games/`

### 4. Editar un Juego Existente

Encuentra el juego que quieres editar y cambia los valores:

```markdown
### Juego 1
- **ID**: game-1
- **Título**: Nuevo Nombre         ← Cambia aquí
- **Categoría**: Nueva Categoría   ← Cambia aquí
- **Imagen**: /images/games/nueva-imagen.jpg  ← Cambia aquí
```

### 5. Eliminar un Juego

Simplemente elimina todas las líneas del juego, desde `### Juego X` hasta antes del siguiente `###`.

### 6. Agregar una Nueva Categoría de Servicios

Busca **"## Categorías de Servicios"** y agrega:

```markdown
### Categoría 9: Nombre de la Categoría
- **ID**: nueva-categoria
- **Nombre**: Nombre de la Categoría
```

### 7. Agregar un Nuevo Servicio

Busca **"## Servicios"** y agrega:

```markdown
### Servicio Nuevo 1
- **ID**: nuevo-1
- **Título**: Nombre del Servicio
- **Categoría**: id-de-la-categoria
- **Precio**: 30
- **Imagen**: /images/services/servicio.jpg
- **Descripción**:
  - Característica 1 del servicio
  - Característica 2 del servicio
  - Característica 3 del servicio
```

**Importante:**
- El **Categoría** debe coincidir con el **ID** de una categoría existente
- El **Precio** es solo el número (sin símbolo $)
- Puedes agregar tantas características como quieras en la **Descripción**

### 8. Editar el Precio de un Servicio

Encuentra el servicio y cambia el número:

```markdown
- **Precio**: 50  ← Cambia solo el número
```

### 9. Editar las Características de un Servicio

```markdown
- **Descripción**:
  - Nueva característica 1
  - Nueva característica 2
  - Nueva característica 3
  - Puedes agregar más líneas
```

### 10. Eliminar un Servicio

Elimina todas las líneas del servicio, desde `### Servicio X` hasta antes del siguiente `###`.

## 📸 Gestión de Imágenes

### Ubicación de Imágenes

Todas las imágenes deben colocarse en la carpeta **`public/images/`**:

```
public/
└── images/
    ├── games/          ← Imágenes de juegos
    │   ├── juego1.jpg
    │   └── juego2.jpg
    └── services/       ← Imágenes de servicios
        ├── servicio1.jpg
        └── servicio2.jpg
```

### Cómo Agregar una Imagen

1. Coloca tu imagen en la carpeta correspondiente:
   - Juegos: `public/images/games/`
   - Servicios: `public/images/services/`

2. Referencia la imagen en el archivo `config.md`:
   ```markdown
   - **Imagen**: /images/games/mi-nueva-imagen.jpg
   ```

**Nota:** La ruta siempre empieza con `/images/` (sin incluir `public`).

### Formatos Recomendados

- **Formato:** JPG, PNG o WebP
- **Tamaño Juegos:** 800x600px (4:3)
- **Tamaño Servicios:** 600x400px (3:2)
- **Peso máximo:** 500KB por imagen

## ⚠️ Reglas Importantes

### ✅ Hacer

- Siempre mantén el formato de las líneas (con `- **Campo**:`)
- Usa IDs únicos sin espacios (usa guiones en lugar de espacios)
- Asegúrate de que cada servicio tenga una categoría existente
- Verifica que las rutas de imágenes sean correctas

### ❌ NO Hacer

- No elimines las secciones principales (las que empiezan con `##`)
- No cambies el formato de las viñetas (`-`)
- No uses caracteres especiales en los IDs
- No pongas espacios al inicio de las líneas

## 🔄 Después de Hacer Cambios

1. **Guarda el archivo** `config.md`
2. **Reinicia el servidor** si está en modo desarrollo:
   - Presiona `Ctrl+C` en la terminal
   - Ejecuta `pnpm dev` nuevamente
3. **Actualiza el navegador** para ver los cambios

## 💡 Ejemplos Completos

### Ejemplo: Agregar un Juego Completo

```markdown
### Juego 5
- **ID**: dragons-quest
- **Título**: Dragon's Quest Online
- **Categoría**: MMORPG
- **Imagen**: /images/games/dragons-quest.jpg
```

### Ejemplo: Agregar un Servicio Completo

```markdown
### Servicio Power Leveling 3
- **ID**: pl-3
- **Título**: Level Boost Supreme
- **Categoría**: power-leveling
- **Precio**: 75
- **Imagen**: /images/services/level-boost.jpg
- **Descripción**:
  - Nivel 1 a 100 en 48 horas
  - Equipo legendario incluido
  - Garantía de satisfacción 100%
  - Soporte VIP 24/7
```

## 🆘 Problemas Comunes

### El sitio no muestra mi nuevo juego/servicio

- Verifica que el formato sea exactamente igual a los ejemplos
- Asegúrate de haber guardado el archivo
- Reinicia el servidor de desarrollo

### Las imágenes no se cargan

- Verifica que la imagen esté en la carpeta correcta dentro de `public/images/`
- Asegúrate de que la ruta en el config.md sea correcta
- Verifica que el nombre del archivo coincida exactamente (incluyendo mayúsculas)

### Los servicios no aparecen en la categoría

- Verifica que el **ID** de la categoría en el servicio coincida con el **ID** de la categoría en la sección de categorías

## 📞 Soporte

Si tienes problemas o necesitas ayuda adicional, contacta al equipo de desarrollo.

---

**¡Importante!** Siempre haz una copia de seguridad del archivo `config.md` antes de hacer cambios importantes.
