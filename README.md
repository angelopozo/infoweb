# Radar Sostenible

Sitio educativo de una sola página que aborda tres retos ambientales inaplazables —crisis del agua dulce, contaminación por plásticos y deforestación industrial— combinando narrativa, datos y animaciones modernas.

## Estructura

- `index.html`: landing única con hero inmersivo, secciones detalladas para cada reto, visualizaciones y plan de acción.
- `css/variables.css`: tokens de diseño compartidos (paleta, radios, ritmo de espacios).
- `css/style.css`: estilos base, componentes y efectos avanzados (glassmorphism, tarjetas, botones, animaciones).
- `css/responsive.css`: container queries y puntos de ruptura para la experiencia responsiva.
- `js/main.js`: navegación, scrollspy accesible, control del menú móvil, acordeones “ver más” y botón volver arriba.
- `js/animaciones.js`: intersecciones, animaciones contextuales, parallax motion-safe y contadores con `requestAnimationFrame`.
- `js/visualizaciones.js`: gráficos canvas con datos locales (`data/datos.json`) y fallback para `roundRect`.
- `assets/img/`: imágenes optimizadas (Unsplash) usadas en hero y capítulos.
- `data/datos.json`: dataset normalizado 2021-2023 para alimentar las visualizaciones.

## Cómo ejecutar

1. Abre la carpeta del proyecto en tu editor preferido.
2. Inicia _Live Server_ (o cualquier servidor estático) apuntando a `index.html`.
3. Navega por los enlaces del encabezado para saltar a cada sección; el scrollspy resaltará la sección activa.

> Tailwind se carga mediante Play CDN, así que no necesitas instalar dependencias ni compilar assets.

## Accesibilidad y animaciones

- Enlace de salto al contenido, navegación sticky con `aria-current`, menú hamburguesa accesible y foco visible personalizado.
- Las animaciones se gobiernan con IntersectionObserver y Web Animations API; se desactivan automáticamente cuando `prefers-reduced-motion` está activo.
- Imágenes con `alt`, `width/height`, `loading` y `decoding` configurados para mantener el rendimiento y la estabilidad del layout.

## Rendimiento y diseño

- Layout mobile-first con `grid`, `flex` y _container queries_.
- Glassmorphism controlado, sombras suaves y gradientes dinámicos para dar un acabado premium sin sacrificar legibilidad.
- Visualizaciones en canvas nativo (sin librerías externas) y datos locales para ejecutar offline.

## Próximos pasos sugeridos

- Conectar el formulario de descarga del toolkit a un backend o servicio de automatización.
- Internacionalizar el contenido y valores de los gráficos para audiencias multi-región.
- Explorar pruebas de usabilidad con lectores de pantalla para validar la experiencia accesible.
