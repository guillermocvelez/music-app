# Prompt Para Google Stitch (Metronomo App)

## Objetivo
Rediseñar la interfaz de una app web de metronomo y entrenamiento auditivo para que se vea moderna, clara, profesional y usable en desktop/tablet/mobile, manteniendo la funcionalidad actual.

## Contexto Del Producto
- Tipo: aplicacion musical (metronomo + ear training).
- Framework actual: Vue 3 (SPA).
- Tema: dark/light con variables CSS.
- Idioma principal UI: espanol.
- Usuario objetivo: estudiantes de musica y musicos practicando ritmo/oido.

## Pantallas/Secciones Actuales
1. Header:
- Logo "theMusicTools"
- Navegacion principal: Metronome, Ear Training, Library, Settings
- Toggle de tema
- Boton "Iniciar sesion con Google" (placeholder, no funcional por ahora)
- Avatar y estado de cuenta (placeholder)

2. Vista Metronome:
- Dial BPM central con anillo de progreso y botones +/-
- Countdown de timer visible
- Favoritos de BPM (guardar, agregar manual, eliminar, persistencia en localStorage)
- Panel izquierdo: presets de tempo (Largo, Adagio, etc.)
- Panel derecho: time signatures, subdivisions, click sound
- Barra inferior:
  - Precision slider
  - Tap tempo
  - Play/Pause
  - Timer con modal (min/seg)
  - Volume slider

3. Vista Ear Training:
- Curso progresivo por niveles/unidades
- Lista de temas y actividades por unidad
- Progress tracking por unidad (localStorage)
- Practice lab por unidad (generar/reproducir/revelar ejercicio)

## Problemas A Resolver Con El Rediseño
- Mejorar jerarquia visual y legibilidad general.
- Reducir saturacion visual en controles.
- Asegurar navegacion centrada y limpia en header.
- Mejorar espaciado, alineacion y consistencia de componentes.
- Diseñar una experiencia responsive real (desktop/tablet/mobile).
- Mantener accesibilidad (contraste, foco visible, tamanos clickeables).

## Restricciones Tecnicas
- Mantener estructura compatible con Vue component-based.
- Mantener soporte dark/light theme.
- No eliminar funcionalidades existentes.
- No agregar autenticacion real todavia (boton Google solo visual).
- No usar estilos dependientes de librerias externas no incluidas.

## Direccion Visual Deseada
- Estilo: minimal, musical-tech, limpio, premium.
- Tipografia:
  - Display: Bebas Neue (titulos/branding)
  - Body/UI: tipografia altamente legible (Inter/Segoe UI/Roboto)
- Paleta:
  - Accent principal naranja (#ff6b00 aprox)
  - Superficies neutras limpias
  - Alto contraste en textos y estados activos
- Componentes:
  - Cards, pills, sliders y botones con estados claros (hover/active/focus/disabled)
  - Modales con mejor estructura visual y jerarquia
  - Tabs/side navigation para curso de ear training

## Layout De Colores Actual (Respetar Base)
Regla:
- Mantener `--color-accent` naranja como identidad principal.
- Si propones variaciones, que sean evolutivas y no un cambio radical de branding.

### Dark Theme (default)
- `--color-bg`: `#111111`
- `--color-panel`: `#1a1a1a`
- `--color-panel-border`: `#333333`
- `--color-surface-1`: `#1a1e26`
- `--color-surface-2`: `#1f232c`
- `--color-surface-3`: `#2a303c`
- `--color-overlay-soft`: `rgba(255, 255, 255, 0.05)`
- `--color-overlay-strong`: `rgba(255, 255, 255, 0.12)`
- `--color-text-primary`: `#ffffff`
- `--color-text-secondary`: `#a1a1a1`
- `--color-text-muted`: `#555555`
- `--color-accent`: `#ff6b00`
- `--color-accent-glow`: `rgba(255, 107, 0, 0.4)`
- `--color-ring-track`: `#333333`
- `--color-on-accent`: `#000000`
- `--color-dial-foreground`: `#ffffff`

### Light Theme (`.light-theme`)
- `--color-bg`: `#f8fafc`
- `--color-panel`: `#ffffff`
- `--color-panel-border`: `#d1d5db`
- `--color-surface-1`: `#f1f5f9`
- `--color-surface-2`: `#e2e8f0`
- `--color-surface-3`: `#cbd5e1`
- `--color-overlay-soft`: `rgba(15, 23, 42, 0.04)`
- `--color-overlay-strong`: `rgba(15, 23, 42, 0.08)`
- `--color-text-primary`: `#111827`
- `--color-text-secondary`: `#374151`
- `--color-text-muted`: `#6b7280`
- `--color-accent`: `#ff6b00`
- `--color-accent-glow`: `rgba(255, 107, 0, 0.2)`
- `--color-ring-track`: `#94a3b8`
- `--color-on-accent`: `#111827`
- `--color-dial-foreground`: `#111827`

### Uso Recomendado De Tokens
- Fondos base: `--color-bg`, `--color-panel`
- Contenedores secundarios: `--color-surface-1/2/3`
- Bordes/divisores: `--color-panel-border`
- Texto: `--color-text-primary/secondary/muted`
- Call to action: `--color-accent` + `--color-on-accent`
- Overlays/hover sutiles: `--color-overlay-soft/strong`
- Elementos del dial BPM: `--color-ring-track`, `--color-dial-foreground`

## Entregables Que Quiero De Stitch
1. Propuesta de layout global (desktop + tablet + mobile)
2. Sistema de estilos (tokens: color, spacing, typography, radius, shadow)
3. Rediseño de:
- Header
- Dial BPM + favoritos
- Paneles laterales del metronomo
- Bottom controls
- Modal de timer
- Vista completa de Ear Training (curso + practice lab)
4. Estados UI:
- Empty states
- Active/selected
- Error/validation
- Completed progress
5. Microinteracciones sugeridas (sin exagerar)

## Prompt Directo (Copiar Y Pegar)
Disena una UI completa para una app web de musica llamada "theMusicTools" con dos vistas principales: "Metronome" y "Ear Training".  
La app ya tiene funciones listas, asi que enfocate en redisenar la experiencia visual y de navegacion sin eliminar features.

Requisitos:
- Estilo moderno, limpio, premium, orientado a practica musical.
- Responsive real: desktop, tablet y mobile.
- Tema dark/light con alto contraste y accesibilidad.
- Tipografia: Bebas Neue para titulos/branding; fuente legible para cuerpo.
- Color accent principal: naranja (#ff6b00 aprox).

Componentes a redisenar:
- Header con logo, nav centrada, toggle de tema, boton "Iniciar sesion con Google" (placeholder), avatar.
- Vista Metronome: dial BPM central con anillo de progreso, botones +/-; timer countdown; favoritos BPM en tarjeta clara; paneles de presets y configuraciones; barra inferior con precision slider, tap tempo, play/pause, timer y volumen.
- Modal de timer para programar minutos/segundos.
- Vista Ear Training: estructura de curso por niveles y unidades, temas/actividades por unidad, progreso visible, laboratorio de practica (generar, reproducir, revelar).

Entregar:
- Layout final por breakpoint.
- Design tokens (colores, spacing, tipografia, bordes, sombras).
- Estados visuales completos (hover, focus, active, disabled, error, success, completed).
- Componentes consistentes y listos para implementacion en Vue.

No cambies la logica del producto; solo mejora arquitectura visual, usabilidad y claridad.
