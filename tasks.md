# Tasks — Plan de implementación

Cada tarea referencia el requerimiento que cumple (ver requirements.md) y
la sección de diseño correspondiente (ver design.md). Ejecutar en orden;
cada fase debe quedar funcional antes de pasar a la siguiente.

## Fase 0 — Setup del proyecto

- [x] 0.1 Inicializar repo con dos carpetas: `backend/` (Node + Express)
      y `frontend/` (React + Vite).
- [x] 0.2 Configurar PostgreSQL local (o Docker Compose con un servicio
      `postgres`) y variables de entorno (`.env`) para la conexión.
- [x] 0.3 Instalar y configurar el ORM elegido (Prisma recomendado) en
      `backend/`.
- [x] 0.4 Configurar estructura de carpetas del backend: `routes/`,
      `controllers/`, `services/`, `models/` (o `prisma/schema.prisma`
      si se usa Prisma).

## Fase 1 — Modelo de datos (design.md §2)

- [x] 1.1 Crear el schema/migraciones para las tablas: `ingredient`,
      `unit_conversion`, `recipe`, `recipe_ingredient`, `meal_plan`,
      `meal_plan_entry`, con los campos y constraints de design.md §2.2.
- [x] 1.2 Correr la migración inicial contra la DB local y verificar que
      las tablas se crean correctamente.
- [x] 1.3 Escribir un script de seed con 5-10 ingredientes comunes
      (papa, carne, cebolla, etc.) y sus `unit_conversion` básicas, para
      poder probar el resto de las fases sin cargar todo a mano.

## Fase 2 — Catálogo de ingredientes (Requirement 4.1)

- [x] 2.1 Endpoint `GET /api/ingredients` — listar catálogo.
- [x] 2.2 Endpoint `POST /api/ingredients` — crear ingrediente
      (nombre + unidad_base).
- [x] 2.3 Endpoint `POST /api/ingredients/:id/conversions` — agregar
      factor de conversión.
- [x] 2.4 Validación: no permitir dos ingredientes con el mismo nombre
      (case-insensitive).

## Fase 3 — Recetas (Requirements 1.1, 1.2, 1.3)

- [ ] 3.1 Endpoint `POST /api/recipes` — crear receta con ingredientes
      anidados en el body. Si un ingrediente del body no existe en el
      catálogo, crearlo automáticamente (Requirement 1.1, criterio 2).
- [ ] 3.2 Endpoint `GET /api/recipes/:id` — devolver receta completa con
      sus ingredientes y pasos.
- [ ] 3.3 Endpoint `GET /api/recipes?q=texto` — búsqueda por nombre o
      por nombre de ingrediente (usar `ILIKE` de Postgres o similar).
      Si no hay resultados, devolver `{ results: [], message: "..." }`
      en vez de un array vacío sin contexto (Requirement 1.2).
- [ ] 3.4 Endpoint `PUT /api/recipes/:id` — editar receta existente.
- [ ] 3.5 Tests: crear receta, buscarla, verificar que ingredientes
      nuevos se auto-crearon en el catálogo.

## Fase 4 — Planes semanales (Requirement 2.1, 2.2)

- [ ] 4.1 Endpoint `POST /api/meal-plans` — crear plan (nombre +
      fecha_inicio), generando automáticamente las 14 entradas vacías
      (7 días × 2 comidas) en `meal_plan_entry` con `recipe_id = null`.
- [ ] 4.2 Endpoint `GET /api/meal-plans/:id` — devolver plan con sus 14
      entradas, cada una con receta (si tiene) y comensales.
- [ ] 4.3 Endpoint `PUT /api/meal-plans/:id/entries/:entryId` — asignar
      `recipe_id` y `comensales` a una entrada. Si no se envía
      `comensales`, usar `porciones_base` de la receta como default
      (Requirement 2.1, criterio 2).
- [ ] 4.4 Validación: `comensales` debe ser > 0 si se asigna receta.

## Fase 5 — Cálculo de lista de compras (Requirement 3.1)

- [ ] 5.1 Implementar el servicio `calcularListaDeCompras(mealPlanId)`
      siguiendo el pseudocódigo de design.md §3, como función pura y
      testeable, separada del controller HTTP.
- [ ] 5.2 Endpoint `GET /api/meal-plans/:id/shopping-list` que llama al
      servicio y devuelve el JSON de ejemplo de design.md §4.
- [ ] 5.3 Tests unitarios del servicio con casos:
      - dos recetas distintas que comparten un ingrediente convertible
        → deben sumarse en una sola línea
      - un ingrediente sin conversión definida → debe aparecer en
        `no_convertibles`, no sumado incorrectamente
      - una entrada con `comensales` distinto de `porciones_base` →
        verificar que el factor de escala se aplicó bien
- [ ] 5.4 Verificar tiempo de respuesta (Requirement 3.1, criterio de
      performance) con un plan de 14 entradas.

## Fase 6 — Frontend web

- [ ] 6.1 Vista de búsqueda y listado de recetas (consume Fase 3).
- [ ] 6.2 Vista de detalle de receta.
- [ ] 6.3 Vista de plan semanal: grilla de 7 días × 2 comidas, cada
      celda editable con selector de receta + input de comensales
      (consume Fase 4). Éste es el componente central del
      diferenciador del producto — priorizar que la UX de "cambiar
      comensales de un día puntual" sea rápida (sin recargar toda la
      página).
- [ ] 6.4 Vista de lista de compras generada a partir del plan (consume
      Fase 5), con checkboxes para ir tildando ítems comprados
      (Requirement 3.2 — el estado de tildado puede vivir solo en el
      frontend/localStorage en v1, no hace falta persistirlo en el
      backend).
- [ ] 6.5 Formulario de carga de recetas (para ir poblando la base sin
      tocar la DB a mano).

## Fase 7 — Carga de contenido inicial

- [ ] 7.1 Cargar manualmente 20-30 recetas argentinas comunes a través
      del formulario de la Fase 6.5, cubriendo almuerzo y cena, para
      tener un plan semanal de prueba realista.

---

**Nota para el agente de código:** las Fases 0-5 son backend puro y se
pueden completar y probar con curl/Postman antes de tocar el frontend.
No avanzar a la Fase 6 hasta que los tests de la Fase 5 pasen.
