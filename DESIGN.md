---
name: Clubsy
description: El club de sellos del comercio, en el celular de su cliente, sin descargar nada.
colors:
  clubsy-navy: "#001d67"
  clubsy-orange: "#fc5d00"
  near-black: "#111111"
  paper: "#ffffff"
  ink-text: "oklch(0.145 0 0)"
  muted-text: "oklch(0.556 0 0)"
  hairline: "oklch(0.922 0 0)"
  counter-gray: "oklch(0.97 0 0)"
  alert-red: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.4375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  button:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.3
  micro:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.3
  caption:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  prize:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.1875rem"
    fontWeight: 500
    letterSpacing: "0.025em"
rounded:
  control: "10px"
  card: "14px"
  badge: "24px"
  sheet: "26px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  gutter: "20px"
  lg: "24px"
  card-inset: "18px"
components:
  button-primary:
    backgroundColor: "{colors.clubsy-orange}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "50px"
    width: "100%"
  back-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.pill}"
    size: "40px"
  filter-pill:
    backgroundColor: "{colors.counter-gray}"
    textColor: "{colors.ink-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 16px"
  filter-pill-active:
    backgroundColor: "{colors.clubsy-orange}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 16px"
  text-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 14px"
  floating-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "0 16px 8px"
  sheet:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sheet}"
    padding: "20px 20px 32px"
  icon-disc:
    backgroundColor: "{colors.counter-gray}"
    textColor: "{colors.clubsy-navy}"
    rounded: "{rounded.pill}"
    size: "42px"
  note-box:
    backgroundColor: "{colors.counter-gray}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
---

# Design System: Clubsy

## Overview

**Creative North Star: "La tarjeta de cartón, digital"**

Clubsy es la tarjeta de sellos de siempre, la que te daban en la caja del café, llevada al celular sin perder lo que la hacía querible: círculos vacíos que se van llenando, un premio que se ve desde el primer día y la satisfacción de completarla. El sistema es amigable y con energía: bordes bien redondeados, el color del comercio presente en cada pantalla y pequeñas celebraciones cuando pasa algo bueno. Las pantallas del cliente son de una mano y de pocos segundos (en el mostrador, con el celular en la mano), así que todo lo importante va arriba, grande y a un toque.

El color de cada pantalla no es de Clubsy: es del comercio. Clubsy pone el marco (blanco, Poppins, radios generosos, sombras suaves) y cada local lo llena con su logo, su portada y sus dos colores. Los azules y naranjas de Clubsy son solo el valor por defecto cuando el comercio no cargó los suyos, y la firma "by Clubsy" queda chica, al pie.

Este documento recoge el sistema del lado del cliente tal como quedó en el rediseño (etapa 12: la página del comercio, la carta, el Wi-Fi y el alta). El panel del comercio y el admin todavía tienen la base de shadcn previa y se rediseñan después, sobre este mismo sistema. No hay modo oscuro.

**Key Characteristics:**
- Una franja del color del comercio arriba y, montada encima, una hoja blanca o una tarjeta flotante con el contenido.
- Poppins en toda la app, títulos en semibold con el tracking apenas cerrado.
- Radios generosos y escalonados: 10 px los controles, 14 px las tarjetas, 26 px las hojas, píldoras y círculos.
- Un solo botón lleno por pantalla, con el color de acción del comercio.
- Íconos de línea en círculos con el color del comercio al 8 %.
- Sellos como círculos punteados que se llenan; el último es el premio.

## Colors

Una paleta casi toda blanca y gris, donde el color lo pone el comercio: su principal en la franja y los detalles, su color de acción en el único botón lleno.

### Primary
- **Azul Clubsy** (#001d67): el color principal por defecto (`--primary`) y el de los detalles sobre blanco (`--ink`). Cada comercio lo reemplaza con su color principal en la franja de arriba, la tarjeta de sellos y el fondo del logo sin imagen.

### Secondary
- **Naranja Clubsy** (#fc5d00): el color de acción por defecto (`--cta`) y el anillo de foco (`--ring`). Cada comercio lo reemplaza con su secundario cuando contrasta con el blanco.

### Neutral
- **Papel** (#ffffff): el fondo de las hojas, las tarjetas y la página.
- **Tinta** (oklch(0.145 0 0)): el texto principal.
- **Texto apagado** (oklch(0.556 0 0)): detalles, descripciones de la carta, ayudas y el texto secundario de cada fila.
- **Línea fina** (oklch(0.922 0 0)): separadores de un píxel entre filas y secciones, y el borde de los campos.
- **Gris mostrador** (oklch(0.97 0 0)): las píldoras de filtro sin elegir, el recuadro de condiciones y el fondo del Wi-Fi.
- **Casi negro** (#111111): el reemplazo del color del comercio cuando es demasiado claro para usarse sobre blanco.
- **Rojo alerta** (oklch(0.577 0.245 27.325)): solo para errores de formulario y avisos destructivos.

### Named Rules
**The Merchant Color Rule.** Ninguna pantalla del cliente usa un color de comercio escrito a mano: todo pasa por los tokens que pisa `brandStyle()` (`primary`, `primary-foreground`, `cta`, `cta-foreground`, `ink`, `ticket*`; el anillo de foco usa el mismo color que `cta`). El texto sobre un color (blanco o casi negro) lo decide el contraste, nunca el diseño.

**The 3:1 Ink Rule.** Un color del comercio se usa sobre blanco (íconos, números, links, el QR) solo si contrasta 3:1; si no, se usa casi negro (#111111). El botón principal sigue la misma prueba: secundario, si no principal, si no casi negro.

**The One Filled Button Rule.** Cada vista tiene como mucho un botón lleno con el color de acción. Lo demás son filas con chevron, links en `ink` o botones blancos. Si otro bloque grande tendría el mismo color que el botón (la tarjeta de sellos cuando el secundario no contrasta), ese bloque pasa a un tono suave.

## Typography

**Display Font:** Poppins (con system-ui, sans-serif)
**Body Font:** Poppins (con system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (con ui-monospace), solo para contraseñas y códigos

**Character:** Una sola sans geométrica, redonda y amable, que funciona en los títulos y en el texto corrido. Poppins no es variable: se cargan los pesos 400, 500, 600 y 700, y no se usa ningún otro.

### Hierarchy
- **Display** (600, 1.5rem, 1.25): el título de cada pantalla ("La carta", "Sumate al club de premios", "Tus datos").
- **Headline** (600, 1.4375rem, 1.25): el nombre del comercio debajo de su logo y el nombre de la red Wi-Fi.
- **Title** (600, 1.0625rem, 1.4): las secciones dentro de una hoja ("Cómo funciona", cada categoría de la carta).
- **Body** (400 y 500, 0.875rem, 1.5): el texto de las filas, los productos, los pasos y los formularios. Los campos usan 16 px en el celular.
- **Label** (400, 0.75rem): los detalles en gris de las filas.
- **Micro** (400, 0.6875rem): solo el "desde" arriba de un precio en la carta.
- **Button** (500, 0.9375rem): el texto de los botones llenos y el nombre del comercio en el encabezado del alta.
- **Caption** (400 o 600, 0.8125rem, 1.5): las ayudas, las condiciones, los números de los sellos y los textos chicos de las filas.
- **Prize** (600, 1.375rem, 1.18): el premio en la tarjeta de sellos.

### Named Rules
**The 16px Field Rule.** Todo campo de texto mide 16 px en el celular (15 px desde escritorio): con menos, Safari agranda la pantalla al tocarlo.

## Layout

El cliente vive en el celular: el diseño parte de 390 px de ancho y una sola columna. Las hojas llevan un margen lateral de 20 px; las tarjetas flotantes se separan 18 px de cada borde. En pantallas grandes el contenido se centra con un ancho máximo de 28 rem (448 px) y la franja de color sigue a todo el ancho.

Cada pantalla del cliente arranca igual: la franja del color del comercio (de 72 px con solo "volver", o de 124 px cuando se monta encima una tarjeta flotante) y debajo el contenido. El ritmo vertical se arma de 4 en 4 px, con 20 px entre bloques dentro de una tarjeta, de 18 a 26 px antes de un título de sección y de 10 a 12 px entre filas o pasos. Lo que se toca va abajo y a mano: el botón principal fijo al pie cuando es el único, las píldoras de filtro fijas arriba al hacer scroll.

### Named Rules
**The Strip-and-Sheet Rule.** Toda pantalla del cliente tiene arriba la franja del color del comercio y, encima, una hoja blanca a todo el ancho (radio de 26 px arriba) o una tarjeta flotante (14 px) que se monta sobre el borde de la franja. Nunca un fondo de color detrás del contenido.

## Elevation & Depth

Un sistema mayormente plano con dos niveles de altura. Las hojas no tienen sombra: se separan de la franja por el cambio de color y el radio. Lo que flota sobre la franja (la tarjeta de la página del comercio, la del Wi-Fi, el botón de volver y el logo) lleva una sombra amplia y suave que lo despega sin oscurecer. Las tarjetas dentro de una hoja usan, como mucho, la sombra liviana de tarjeta.

### Shadow Vocabulary
- **Tarjeta flotante** (`box-shadow: 0 2px 6px rgb(0 0 0 / 0.04), 0 12px 32px rgb(0 0 0 / 0.1)`): la tarjeta principal montada sobre la franja.
- **Logo** (`box-shadow: 0 8px 24px rgb(0 0 0 / 0.12)`): el logo de 84 px apoyado en el borde de la tarjeta.
- **Botón de volver** (`box-shadow: 0 4px 12px rgb(0 0 0 / 0.15)`): el círculo blanco sobre la franja.

### Named Rules
**The Float-Over-Color Rule.** La sombra es para lo que se monta sobre el color del comercio. Sobre blanco, las cosas se separan con una línea fina o con el gris mostrador.

## Shapes

Todo es redondeado y en escalones claros, de lo chico a lo grande: los controles (botones, campos, recuadros) a 10 px, las tarjetas a 14 px, el logo a 24 px con un borde blanco de 4 px, las hojas a 26 px en las esquinas de arriba, y los elementos chicos (íconos, sellos, píldoras, el botón de volver) en círculo o píldora. No hay esquinas rectas en nada que se toque. El Wi-Fi y la tarjeta de sellos del alta suman un corte de ticket: dos medialunas del color del fondo en los bordes y una línea punteada.

### Named Rules
**The Last Stamp Is the Prize Rule.** Una tarjeta de sellos se dibuja con círculos punteados y numerados, en filas parejas como la tarjeta del cliente (hasta 7 por fila: 8 sellos van en dos filas de 4), y el último círculo es el premio: lleno, con el ícono de regalo. Con más de 14 sellos, una tira compacta con "0 de N sellos" y el regalo al final.

## Components

### Buttons
Llenos, anchos y con energía: es el único lugar donde el color de acción del comercio ocupa espacio.
- **Shape:** esquinas de 10 px; 50 px de alto y todo el ancho.
- **Primary:** fondo del color de acción (`cta`) con su texto por contraste, en 15 px y peso 500. Se achica un poco al apretarlo.
- **Hover / Focus:** el fondo baja al 90 %; el foco es un anillo de 3 px del color de foco al 50 %.
- **Back:** un círculo blanco de 40 px con el chevron, sobre la franja.
- **Links:** en `ink` y peso 500, sin subrayado, para las acciones secundarias ("Cambiar número", "Usar otra cuenta").

### Chips
- **Style:** píldoras de 36 px de alto, con texto de 13 px y peso 500.
- **State:** sin elegir, en gris mostrador; elegida, con el color de acción. "Todo" va primero y el resto filtra de a una categoría.

### Cards / Containers
- **Corner Style:** 14 px las tarjetas, 26 px arriba las hojas.
- **Background:** papel.
- **Shadow Strategy:** la tarjeta flotante sobre la franja (ver Elevation & Depth); las hojas, sin sombra.
- **Border:** ninguno; los cortes internos son líneas de 1 px.
- **Internal Padding:** 16 px en las tarjetas y 20 px en las hojas.

### Inputs / Fields
- **Style:** fondo blanco, borde de 1 px en línea fina, esquinas de 10 px y 48 px de alto. El código de 6 números va en un campo más alto, centrado y en mono.
- **Focus:** el borde y un anillo de 3 px en el color de foco.
- **Error / Disabled:** borde y texto en rojo alerta, con el mensaje debajo del campo; los errores que no son de un campo van arriba, en un recuadro.

### Navigation
- **Style:** filas de 58 px con un ícono de línea en un círculo de 42 px (`ink` al 8 % de fondo, ícono en `ink`), el texto, un detalle en gris y un chevron. La fila entera se toca y se oscurece apenas al apretarla.
- **Redes:** círculos de 44 px con el mismo tratamiento, sin el nombre debajo, bajo un título "Seguinos".

### Stamp Card
La firma del sistema, como un ticket: arriba "Con N sellos te llevás" y el premio en grande (1.375rem, semibold); un corte de ticket (dos medialunas del color de la hoja y una línea punteada), y abajo los sellos numerados (círculos punteados del texto al 50 %, con el número al 85 %, que se lee bien) y el último lleno con el regalo. Sus colores salen de `brandStyle()` (`--ticket*`): llena del color principal o, cuando el botón principal también usa ese color, en un tono suave del principal (20 %) con el texto en `ink` y el regalo lleno, para que el botón siga siendo el único bloque lleno de la pantalla. En la bienvenida del alta muestra "Tu tarjeta" con el nombre del cliente, "0 de N sellos · Tu primer sello te espera" y el primer sello como "el próximo": punteado más grueso, que late suave tres veces (sin rebote; quieto con las animaciones reducidas). Nunca se dibuja lleno un sello que el cliente no tiene.

### Steps
Listas numeradas con el número en un círculo de 26 px (`ink` al 8 % de fondo) y el texto al lado, en 14 px. Se usan para "Cómo funciona", los pasos del Wi-Fi y cualquier instrucción corta.

### Note Box
Un recuadro gris mostrador con esquinas de 10 px, un título chico en semibold y el texto en 13 px, para las condiciones del premio y otros avisos sin urgencia.

## Do's and Don'ts

### Do:
- **Do** arrancar cada pantalla del cliente con la franja del color del comercio y una hoja blanca (26 px) o una tarjeta flotante (14 px) encima.
- **Do** usar los tokens del comercio (`primary`, `cta`, `ink` y sus textos) en lugar de colores fijos, y dejar que el contraste elija el texto.
- **Do** mantener un solo botón lleno por vista, de 50 px de alto y 10 px de radio.
- **Do** dibujar las tarjetas de sellos con círculos punteados y numerados, y el premio en el último.
- **Do** celebrar lo que logra el cliente (un sello, un canje, el alta) con un mensaje cálido y corto.
- **Do** poner los íconos de línea dentro de un círculo con el color del comercio al 8 %, del tamaño justo para el ícono.

### Don't:
- **Don't** agregar modo oscuro: la marca de Clubsy va sobre fondo blanco.
- **Don't** poner el nombre debajo de los íconos de redes ni dejar mucho aire entre el ícono y su círculo.
- **Don't** usar el color de un comercio sobre blanco si no contrasta 3:1: se usa casi negro.
- **Don't** usar campos con texto de menos de 16 px en el celular.
- **Don't** poner contadores que no ayudan a decidir (por ejemplo, la cantidad de productos de cada categoría de la carta).
- **Don't** competir con la marca del comercio: Clubsy solo firma al pie.
