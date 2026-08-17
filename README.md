# 🍕 FOCACCIA — Bar de Pizzas

Sitio web para **FOCACCIA**, bar de pizzas de horno a leña en Punta Colorada, Maldonado, Uruguay. Construido con **HTML, CSS y JavaScript puros**, sin frameworks ni dependencias de build.

🔗 **[Ver demo](#)** _(agregá el link una vez publicado)_

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Características

- **Mobile-first** — el layout parte del diseño móvil y escala hacia desktop con `clamp()` y grillas responsivas.
- **Sin frameworks** — HTML, CSS y JS vanilla. Sin build step, sin dependencias, sin `node_modules`.
- **Accesible (ARIA)** — skip-link, `role="tablist"` en el menú, foco visible, `prefers-reduced-motion` respetado, alt descriptivo en cada imagen.
- **SEO on-page** — meta description, Open Graph, Twitter Cards, `rel="canonical"` y datos estructurados **JSON-LD** (`schema.org/Restaurant`) con dirección, horarios y teléfono.
- **Menú interactivo** — pestañas por categoría (Pizzas, Focaccia & Fainá, Sándwiches, Cazuelas, Postres) navegables con teclado.
- **Galería con lightbox** — sin librerías externas.
- **Contacto directo** — botón flotante de WhatsApp y links de reserva con mensaje precargado.

## 📁 Estructura del proyecto

```
.
├── index.html          # Documento principal
├── css/
│   └── styles.css      # Estilos (tokens de diseño, mobile-first)
├── js/
│   └── script.js       # Navegación, tabs, lightbox, scroll reveal
├── assets/
│   └── img/             # Imágenes optimizadas en WebP + logo/favicon
└── README.md
```

## 🎨 Paleta

| Token | Color | Uso |
|---|---|---|
| `--crema` | `#F1E4D0` | Fondo principal |
| `--espresso` | `#2B1D14` | Texto principal |
| `--verde-italia` | `#2F5D3F` | Acento (bandera IT) |
| `--rojo-italia` | `#A8351F` | Acento (bandera IT) |
| `--oro-masa` | `#C08B2E` | Precios / detalles |

Tipografías: **Fraunces** (display), **Work Sans** (texto), **Space Mono** (precios/etiquetas), vía Google Fonts.

## 🚀 Uso local

No requiere instalación ni build. Basta con servir la carpeta con cualquier servidor estático:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node
npx serve .
```

Luego abrí `http://localhost:8000` en el navegador.

## 🌐 Deploy

Al ser HTML/CSS/JS estático, se puede publicar directamente en:

- **GitHub Pages** — activar en `Settings → Pages → Deploy from branch`.
- **Netlify / Vercel** — arrastrar la carpeta o conectar el repo (no requiere build command).

## ✏️ Editar contenido

- **Menú y precios**: directamente en `index.html`, dentro de cada `<div class="menu-panel">`.
- **Datos de contacto/horarios**: buscar `Águila Mora`, `091537001` y el bloque `openingHoursSpecification` (JSON-LD) en el `<head>`.
- **Imágenes**: reemplazar en `assets/img/` manteniendo los mismos nombres de archivo, o actualizar las rutas en el HTML.

## 📄 Licencia

Contenido y marca © Focaccia — bar de pizzas. Código base disponible para uso y adaptación del sitio.
