# ✦ LUXE Store — E-commerce

> Proyecto final del curso **Laboratorio de Aplicaciones Web** · Profesor: Carlos Jesus

---

## Descripción

LUXE Store es una aplicación web de e-commerce que consume la [FakeStoreAPI](https://fakestoreapi.com/) para mostrar productos, permitir filtrarlos por categoría, buscarlos, agregarlos a un carrito de compras y simular una compra. Incluye un sistema de autenticación con usuarios de prueba y persistencia de datos mediante localStorage.

---

## Funcionalidades

| # | Funcionalidad | Estado |
|---|--------------|--------|
| 1 | Listado de productos desde FakeStoreAPI
| 2 | Modal con detalle del producto (título, precio, descripción, rating)
| 3 | Cerrar modal con X o con "Agregar al carrito"
| 4 | Agregar producto al carrito + persistencia en localStorage + notificación
| 5 | Ícono de carrito en navbar con badge de cantidad
| 6 | Sidebar con listado de productos en carrito
| 7 | Controles de cantidad por producto (+/-) con estados habilitado/deshabilitado
| 8 | Precio final por ítem actualizado según cantidad
| 9 | Botón eliminar producto individual del carrito
| 10 | Botón vaciar carrito completo
| 11 | Finalizar compra: limpiar carrito + mensaje de confirmación
| 12 | Buscador de productos por nombre y categoría
| 13 | Filtros por categoría (botones + Swiper sincronizados)
| 14 | Login con usuarios mock y guard de sesión
| 15 | Logout con confirmación

---

## Tecnologías

- **HTML5** semántico — `header`, `nav`, `main`, `section`, `article`, `footer`, `aside`
- **CSS3** custom con variables + **Bootstrap 5.3**
- **JavaScript** vanilla ES6+ — DOM, Fetch API, LocalStorage
- **SweetAlert2** — alertas, toasts y confirmaciones
- **Swiper.js** — carrusel de categorías responsive
- **Bootstrap Icons** — iconografía
- **FakeStoreAPI** — fuente de datos de productos y categorías
- **Google Fonts** — tipografías Cormorant Garamond y DM Sans

---

## Decisiones técnicas

### Arquitectura de archivos JS

El código JavaScript está dividido en cinco módulos con responsabilidad única, cargados en orden de dependencias:

```
js/
├── storage.js   # Capa de abstracción sobre localStorage
├── api.js       # Fetch a FakeStoreAPI
├── cart.js      # Lógica del carrito (estado en memoria)
├── ui.js        # Manipulación del DOM: modal, sidebar, alertas
├── products.js  # Render del grid, Swiper, filtros, buscador
└── main.js      # Inicialización, guard de sesión, event listeners
```

### Autenticación mock

El login usa usuarios hardcodeados en el propio `login.html`. En un proyecto real estas credenciales vendrían de una API con hashing de contraseñas. La sesión se guarda en localStorage y un guard en `main.js` redirige al login si no hay sesión activa al cargar `index.html`.

### Sincronización de filtros y Swiper

Los filtros de categoría existen en dos lugares: los botones sobre el grid y los slides del Swiper. Ambos comparten el mismo estado (`activeCategory`) y se sincronizan entre sí mediante las funciones `syncFilterButtons` y `syncCategorySlides`, de modo que seleccionar desde cualquiera de los dos actualiza al otro.

### Buscador en sección de productos

El buscador se ubica junto a los filtros de categoría en lugar de en la navbar. La decisión es semántica y de UX: el buscador filtra productos, por lo que su lugar natural es la sección de productos. Al estar en el navbar, el usuario podría buscar antes de hacer scroll hasta el grid y no ver el resultado de la búsqueda.

---

## Diseño

### Paleta de colores

El proyecto usa un tema **dark luxury** construido sobre variables CSS:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-bg` | `#0e0e0e` | Fondo global |
| `--color-surface` | `#161616` | Cards, sidebar, modales |
| `--color-surface-2` | `#1e1e1e` | Inputs, fondos secundarios |
| `--color-gold` | `#c9a84c` | Color principal |
| `--color-gold-light` | `#e2c47a` | Hover de elementos dorados |
| `--color-text` | `#e8e2d9` | Texto principal |
| `--color-text-muted` | `#7a7469` | Texto secundario y placeholders |
| `--color-border` | `#2a2a2a` | Bordes y separadores |

El dorado (`#c9a84c`) funciona como único color de resaltado en toda la interfaz: badges, precios, hovers, botones primarios y estados activos.

### Tipografía

Se combinan dos familias de Google Fonts con roles diferenciados:

- **Cormorant Garamond** — serif editorial, usada en títulos, precios, nombres de productos y el logotipo.
- **DM Sans** — sans-serif geométrica de bajo contraste, usada en textos de interfaz, botones, etiquetas y navegación.

### Animaciones

Las animaciones son sutiles y tienen propósito funcional:

- **Hero fadeIn** — el contenido del hero entra con `opacity: 0 → 1` y `translateY(30px → 0)` en cascada (eyebrow → título → subtítulo → botón), con delays escalonados de 0.2s.
- **Cards stagger** — cada card del grid tiene un `animation-delay` incremental de 50ms, generando una entrada en cascada que guía la vista del usuario de izquierda a derecha.
- **Hover en cards** — `translateY(-6px)` con cambio de `border-color` y `box-shadow` dorado, indicando interactividad sin ser disruptivo.
- **Sidebar del carrito** — entra desde la derecha con `translateX(100% → 0)` y un overlay con `backdrop-filter: blur(2px)`.
- **Badge bump** — al agregar un producto, el badge del carrito escala brevemente a `1.4` antes de volver a su tamaño normal, confirmando la acción sin una alerta.
- **Navbar scroll** — el fondo de la navbar pasa de `rgba(10,10,10,0.85)` a `0.98` al hacer scroll, reforzando la sensación de profundidad.

Todas las transiciones usan `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out pronunciado), que da una sensación de respuesta inmediata con una deceleración suave al final.

---

## Estructura del proyecto

```
ecommerce/
├── index.html
├── login.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── storage.js
    ├── api.js
    ├── cart.js
    ├── ui.js
    ├── products.js
    └── main.js
```

---

## Cómo ejecutar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Jbcec/tp-lab-app-web.git
   cd luxe-store/ecommerce
   ```

2. Servir con un servidor local:
   ```bash
   npx serve .
   ```

3. Acceder a `http://localhost:3000/login.html`

> ⚠️ Es necesario un servidor local para que el fetch a la API no sea bloqueado por el navegador. No abrir `index.html` directamente con `file://`.

### Usuarios de prueba

| Usuario | Email | Contraseña |
|---------|-------|-----------|
| Admin | admin@luxe.com | admin123 |
| Usuario | usuario@luxe.com | user123 |
| Demo | demo@luxe.com | demo123 |

---

## Integrantes

| Nombre | GitHub |
|--------|--------|
  | Juan Bautista Cechetto Landó | https://github.com/Jbcec |  https://www.linkedin.com/in/juanbautistacechettoland%C3%B3/
