# Requirements — Plataforma de Planificación de Recetas y Compras

## Contexto del proyecto

Plataforma web personal para buscar recetas, planificar las comidas de la
semana indicando cuántas personas comen en cada comida, y generar
automáticamente la lista de ingredientes y cantidades exactas necesarias.

**Diferenciador clave:** la cantidad de comensales se define por día y por
comida (no por receta), y el sistema recalcula automáticamente las
cantidades de ingredientes en base a eso.

---

## Feature 1 — Gestión de recetas

### User Story 1.1
Como usuario, quiero cargar una receta con sus ingredientes y pasos, para
tener mi propia base de datos de recetas.

**Criterios de aceptación:**
- CUANDO el usuario carga una receta con nombre, porciones base, tipo de
  comida, ingredientes (cantidad + unidad) y pasos, ENTONCES el sistema
  DEBE guardarla y hacerla disponible para búsqueda.
- SI un ingrediente cargado no existe en el catálogo de ingredientes,
  ENTONCES el sistema DEBE crearlo automáticamente en el catálogo.
- CUANDO el usuario carga una cantidad sin unidad reconocida (ej. "1
  pizca"), ENTONCES el sistema DEBE permitir guardarla igual, marcada
  como no convertible automáticamente.

### User Story 1.2
Como usuario, quiero buscar una receta por nombre o ingrediente, para
encontrar rápido qué cocinar.

**Criterios de aceptación:**
- CUANDO el usuario busca por texto (ej. "milanesas"), ENTONCES el
  sistema DEBE devolver las recetas cuyo nombre o ingredientes coincidan.
- CUANDO no hay resultados, ENTONCES el sistema DEBE informarlo
  claramente en vez de devolver una lista vacía sin contexto.

### User Story 1.3
Como usuario, quiero ver el detalle completo de una receta (ingredientes
con cantidades para las porciones base, y pasos), para saber cómo
cocinarla.

---

## Feature 2 — Planificación semanal con comensales variables

### User Story 2.1
Como usuario, quiero armar un plan para una semana definiendo, para cada
día y cada tipo de comida (almuerzo/cena), qué receta se cocina y cuántas
personas comen, para no tener que recalcular cantidades a mano.

**Criterios de aceptación:**
- CUANDO el usuario crea un plan semanal, ENTONCES el sistema DEBE
  permitir asignar, para cada combinación día + tipo de comida, una
  receta y un número de comensales independiente del resto de la semana.
- SI el usuario no asigna comensales a una entrada, ENTONCES el sistema
  DEBE usar las porciones base de la receta como valor por defecto.
- CUANDO el usuario deja un día/comida sin receta asignada, ENTONCES el
  sistema NO DEBE incluirlo en el cálculo de compras.
- CUANDO el usuario edita el número de comensales de una entrada ya
  guardada, ENTONCES el sistema DEBE recalcular la lista de compras
  correspondiente la próxima vez que se consulte.

### User Story 2.2
Como usuario, quiero ver mi semana planificada de un vistazo (qué se
cocina cada día y para cuántos), para revisar el plan antes de comprar.

---

## Feature 3 — Cálculo automático de lista de compras

### User Story 3.1
Como usuario, quiero que el sistema sume automáticamente todos los
ingredientes de todas las comidas planificadas de la semana, ajustados
por comensales, para saber exactamente qué y cuánto comprar.

**Criterios de aceptación:**
- CUANDO se genera la lista de compras de un plan semanal, ENTONCES el
  sistema DEBE, para cada entrada del plan, escalar las cantidades de
  ingredientes por el factor `comensales / porciones_base` de la receta.
- CUANDO dos o más entradas del plan usan el mismo ingrediente,
  ENTONCES el sistema DEBE sumarlas en una sola línea de la lista,
  convertidas a una unidad común.
- SI un ingrediente tiene cantidades en unidades no convertibles entre sí
  (ej. "2 unidades" y "300 g" del mismo ingrediente sin equivalencia
  definida), ENTONCES el sistema DEBE mostrar ambas cantidades por
  separado en la misma línea, en vez de sumarlas incorrectamente.
- CUANDO el usuario solicita la lista de compras, ENTONCES el sistema
  DEBE responder en menos de 2 segundos para un plan de una semana.

### User Story 3.2
Como usuario, quiero poder tildar ítems de la lista de compras a medida
que los voy comprando, para llevar seguimiento en el supermercado.

---

## Feature 4 — Catálogo de ingredientes y unidades

### User Story 4.1
Como usuario, quiero que el sistema sepa convertir entre unidades de un
mismo ingrediente (ej. unidades ↔ gramos para "papa"), para que la suma
de la lista de compras sea correcta.

**Criterios de aceptación:**
- CUANDO se define un ingrediente, ENTONCES el sistema DEBE permitir
  asociarle una unidad base (masa, volumen o unidad) y, opcionalmente,
  factores de conversión desde otras unidades usadas en recetas.
- SI un ingrediente no tiene factor de conversión definido entre dos
  unidades usadas, ENTONCES el sistema NO DEBE inventar una conversión;
  debe tratarlas como cantidades separadas (ver 3.1).

---

## Fuera de alcance (v1)

- Cálculo de presupuesto/costo de la compra (pospuesto).
- Integración con supermercados o delivery.
- Información nutricional.
- Multiusuario / cuentas compartidas.
- Importación automática de recetas desde otros sitios.

---

## Próximas Funcionalidades (v2 / Fase 8)

- Buscador inverso de recetas basado en ingredientes en heladera ("¿Qué hay en mi heladera?").
- Importador automatizado de recetas desde URLs web (Web Scraper).
- Sincronización familiar colaborativa en tiempo real (WebSockets / Shareable links).
- Modo Cocina "Sin Manos" (visualización optimizada y bloqueo de suspensión).
- Perfil dietario de usuario y filtros automatizados en el planificador.
- Estimador nutricional y de calorías por porción de receta.
