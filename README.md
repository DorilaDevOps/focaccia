# FOCACCIA — Bar de Pizzas

Sitio web para **FOCACCIA**, bar de pizzas de horno de leña en Punta Colorada, Maldonado, Uruguay. Construido con **HTML, CSS y JavaScript puros**, sin frameworks ni dependencias de build.

**[Ver sitio](https://focacciapcolorada.netlify.app/)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Caracteristicas

### SEO y Social
- **Meta tags completos** — description (<160 chars), keywords, robots, author, lang, canonical, hreflang (es-UY + x-default)
- **Open Graph** — type, title, description, image (1200x630), locale, url, site_name, image:alt
- **Twitter Card** — summary_large_image con imagen optimizada 1200x630, image:alt
- **JSON-LD estructurado** — 5 schemas:
  - `Restaurant` (con aggregateRating y hasMenu)
  - `WebSite` + `SearchAction` (para sitelinks en Google)
  - `Organization` (identidad de marca)
  - `FAQPage` (6 preguntas frecuentes)
  - `Event` (Feria de la Pizza UY 2026)

### Accesibilidad (a11y)
- **Skip-link** — "Saltar al contenido principal" visible al hacer focus
- **ARIA completo** — roles tablist/tab/tabpanel en el menu, aria-expanded en menu mobile, aria-label en botones, aria-labelledby en secciones, aria-hidden en SVGs decorativos
- **Keyboard navigation** — tabs navegables con flechas, lightbox con Escape/flechas/Tab trap, menu mobile con Escape
- **prefers-reduced-motion** — animaciones deshabilitadas automaticamente
- **Alt text descriptivo** — en todas las imagenes
- **Inert en menu cerrado** — menu mobile fuera de tab order cuando esta cerrado
- **Touch targets** — botones minimo 44x44px
- **Focus visible** — outline accesible en todos los elementos interactivos

### Funcionalidad
- **Mobile-first** — layout responsive con clamp() y grillas
- **Menu interactivo** — pestanas por categoria navegables con teclado + buscador que filtra en toda la carta
- **Scroll-spy** — enlace activo segun seccion visible
- **Galeria con lightbox** — sin librerias externas, skeleton shimmer, swipe touch en mobile
- **Seccion FAQ** — acordeon nativo con `<details>/<summary>` sin JavaScript
- **Back to top** — boton flotante que aparece al hacer scroll
- **Mapa embebido** — Google Maps en la seccion Visitanos
- **Contacto directo** — boton flotante de WhatsApp con safe-area para iPhone, toast de feedback al copiar telefono
- **Skeleton loading** — shimmer animation en la galeria mientras cargan las imagenes

---

## Estructura del proyecto

```
.
├── index.html          # Documento principal (SEO, JSON-LD, FAQ)
├── robots.txt          # Reglas para crawlers
├── sitemap.xml         # Sitemap XML
├── css/
│   └── styles.css      # Estilos (tokens de diseno, mobile-first, FAQ, back-to-top)
├── js/
│   └── script.js       # Navegacion, tabs, lightbox, scroll-spy, buscador, back-to-top, toast
├── assets/
│   └── img/            # Imagenes optimizadas en WebP + logo/favicon
└── README.md
```

---

## Paleta

| Token | Color | Uso |
|---|---|---|
| `--crema` | `#F1E4D0` | Fondo principal |
| `--espresso` | `#2B1D14` | Texto principal |
| `--verde-italia` | `#2F5D3F` | Acento (bandera IT) |
| `--verde-claro` | `#b6e0bc` | Fondo menu mobile |
| `--rojo-italia` | `#A8351F` | Acento (bandera IT) |
| `--oro-masa` | `#C08B2E` | Precios / detalles |

Tipografias: **Fraunces** (display), **Work Sans** (texto), **Space Mono** (precios/etiquetas), via Google Fonts.

---

## Uso local

No requiere instalacion ni build. Basta con servir la carpeta con cualquier servidor estatico:

```bash
# Opcion 1: Python
python3 -m http.server 8000

# Opcion 2: Node
npx serve .
```

Luego abri `http://localhost:8000` en el navegador.

## Deploy

Al ser HTML/CSS/JS estatico, se puede publicar directamente en:

- **GitHub Pages** — activar en `Settings > Pages > Deploy from branch`.
- **Netlify / Vercel** — arrastrar la carpeta o conectar el repo (no requiere build command).

## Editar contenido

- **Menu y precios**: directamente en `index.html`, dentro de cada `<div class="menu-panel">`.
- **FAQ**: buscar `<section id="faq">` en `index.html`. Agregar/quitar preguntas con `<details class="faq-item">`.
- **Datos de contacto/horarios**: buscar `Águila Mora`, `091537001` y el bloque `openingHoursSpecification` (JSON-LD) en el `<head>`.
- **JSON-LD**: todos los schemas estan en el `<head>`, separados por tipo (Restaurant, WebSite, Organization, FAQPage, Event).
- **Imagenes**: reemplazar en `assets/img/` manteniendo los mismos nombres de archivo, o actualizar las rutas en el HTML.

---

## Changelog

### v1.3
- SEO: `hreflang="x-default"`, `robots` mejorado con `max-image-preview:large`, keywords actualizadas
- Open Graph: imagen actualizada a hero-oven.webp (1200x630), `og:image:alt`, `og:image:type`
- Twitter Card: imagen actualizada a 1200x630, `twitter:image:alt`
- JSON-LD: 5 schemas (Restaurant con rating+menu, WebSite+SearchAction, Organization, FAQPage, Event)
- Seccion FAQ visible con acordeon nativo (`<details>/<summary>`)
- Boton "Volver arriba" flotante con fade-in/out
- Fix: hero-actions (botones siempre en misma fila en mobile)
- A11y: touch targets mejorados en hero-actions mobile

### v1.2
- Tabs accesibles con WAI-ARIA, lightbox moderno, skeleton loading, scroll-spy

### v1.1
- Menu mobile, responsive, WhatsApp FAB

### v1.0
- Lanzamiento inicial

---

## Licencia

Contenido y marca (c) Focaccia — bar de pizzas. Codigo base disponible para uso y adaptacion del sitio.
