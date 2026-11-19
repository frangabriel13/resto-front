# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Cliente del local** (principal): mayormente gente joven, acostumbrada a apps y a escanear QR, con celulares recientes. Está en el mostrador o en la mesa de una cafetería, panadería o heladería, con el celular en la mano y poco tiempo. Quiere ver qué premio hay, sumarse en segundos, mostrar su QR para que le sumen el sello y saber cuánto le falta.
- **Empleado del local**: atiende con el local lleno. Escanea el QR de la tarjeta del cliente desde el panel, confirma el sello o el canje y sigue atendiendo. Necesita la menor cantidad de toques y errores claros (QR vencido, cooldown, cliente de otro local, saldo insuficiente).
- **Dueño del local**: configura la marca, el premio, la carta, el Wi-Fi y las redes, gestiona a sus empleados y mira la actividad y las estadísticas del club desde el panel.
- **Admin de FullSync**: da de alta los comercios, sus piezas NFC/QR y sus dueños, y activa los clubes.

## Product Purpose

Clubsy (producto de FullSync) es la versión digital de la tarjeta de cartón "juntá 8 sellos y llevate un premio" para locales gastronómicos. En el local hay una pieza física con NFC y QR que abre una web: la página del comercio (club de premios, carta, reseña de Google, Wi-Fi y redes). El cliente se suma con nombre y celular verificado por un código de WhatsApp, junta sellos que confirma un empleado y canjea el premio al completar la tarjeta.

Éxito en el piloto (3 locales, 30 días): que el circuito completo (alta → sello → premio → canje) funcione sin errores ni confusión. Importa más eso que la cantidad de funciones.

## Positioning

- **Sin app ni descarga:** el cliente acerca el celular al cartel (NFC) o escanea el QR y ya está adentro. Es una web mobile; no hay nada que instalar.
- **La marca del comercio manda:** el cliente ve el logo y los colores del local; Clubsy queda de fondo ("by Clubsy").
- **Rápido para el empleado:** escanear → confirmar → listo, en la menor cantidad de toques posible.

## Operating Context

- El cliente usa la web en su celular, de pie en el mostrador o sentado en la mesa, muchas veces con una mano y apurado. Llega tocando la pieza NFC o escaneando su QR; puede volver por la tarjeta guardada (`/c/[slug]`) o la app instalada (PWA liviana, sin modo offline).
- El empleado usa el panel en el celular o la tablet del local, con la cámara para leer el QR de la tarjeta. Si la cámara falla, busca al cliente por teléfono.
- El dueño usa el panel en el celular o la computadora; el admin de FullSync, en la computadora.
- Todo en español rioplatense, con fechas en hora de Buenos Aires.

## Capabilities and Constraints

- Multi-comercio: un solo sistema para todos los locales; la personalización (logo, portada, dos colores, premio, reglas) es configuración, nunca código por cliente.
- Abrir la pieza o consultar la tarjeta nunca suma sellos. El sello y el canje los confirma un empleado; el canje exige el QR de la tarjeta.
- Los carteles NFC también se venden a cualquier comercio, tenga o no club, y redirigen a las reseñas de Google, Instagram o WhatsApp.
- Datos mínimos del cliente: nombre y celular. El consentimiento de marketing es aparte, opcional y desmarcado por defecto.
- El link de reseñas está visible para todos, sin condicionarlo a la valoración ni dar premio a cambio.
- Fuera de alcance por ahora: Apple/Google Wallet, integración con caja, pedidos o carrito, mensajería y campañas, reservas, niveles, referidos, app nativa.
- Por implementar (etapa 13): premio por monto gastado, cambio de regla con fecha límite y plazo opcional para completar la tarjeta.
- Abierto: el valor por defecto del cooldown entre sellos, los textos legales (en revisión del abogado) y los 3 locales del piloto.

## Brand Commitments

- Nombre: Clubsy, de FullSync. Logos en `public/` (`icon.png`, `logo.png` vertical, `logoLateral.png` horizontal).
- Colores de la marca: naranja `#FC5D00` y azul marino `#001D67`, sobre fondo blanco, sin modo oscuro.
- Cada comercio aporta su logo, su portada y dos colores; no hay otras opciones de personalización.
- Voz con el cliente: cálida y festiva, en rioplatense y de vos. Frases cortas, sin tecnicismos, que celebran los logros ("¡Sumaste un sello!", "¡Canjeaste tu premio!"). Con el empleado y el dueño, clara y directa.

## Evidence on Hand

- Comercio de demo `cafe-demo`, con datos ficticios marcados `[DEMO]`, para las demostraciones comerciales.
- No hay testimonios, clientes, métricas ni precios publicados: el piloto todavía no empezó y los 3 locales no están confirmados. No inventarlos.
- Los términos y la política de privacidad son un borrador pendiente de revisión legal.

## Product Principles

1. El circuito alta → sello → premio → canje sin errores ni confusión vale más que cualquier función nueva.
2. El comercio es el protagonista ante su cliente; Clubsy acompaña.
3. Cada toque cuenta: el cliente se suma en segundos y el empleado sella sin frenar la atención.
4. Las reglas del club están a la vista desde el primer momento: el premio y sus condiciones antes de sumarse.
5. Privacidad por defecto: lo mínimo de datos y los consentimientos separados.

## Accessibility & Inclusion

- El texto y los botones se eligen por contraste con los colores de cada comercio (texto blanco o casi negro según el fondo; el botón principal con al menos 3:1 sobre blanco).
- Botones de al menos 44 px de alto y campos con texto de 16 px en el celular, para que Safari no agrande la pantalla.
