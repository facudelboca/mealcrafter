# Design — Plataforma de Planificación de Recetas y Compras

Referencia: requirements.md (todas las decisiones de este documento
existen para cumplir esos criterios de aceptación).

## 1. Arquitectura general

Monolito simple, sin microservicios: no se justifican para el volumen
esperado (uso personal/pequeño).

```
[ React (frontend web) ]
          |
          v  (REST, JSON)
[ Express API (Node.js) ]
          |
          v
[ PostgreSQL ]
```

- **Backend:** Node.js + Express, arquitectura en capas (routes →
  controllers → services → repositories/models).
- **DB:** PostgreSQL, acceso vía un ORM (recomendado: Prisma, por su
  soporte de migraciones y tipado; alternativa: Sequelize).
- **Frontend:** React (Vite), consumiendo la API vía fetch/axios.
- **Autenticación:** fuera de alcance v1 (single-user, sin login).

## 2. Modelo de datos

### 2.1 Diagrama de entidades (conceptual)

```
Ingredient 1---N RecipeIngredient N---1 Recipe
Ingredient 1---N UnitConversion
Recipe 1---N MealPlanEntry N---1 MealPlan
```

### 2.2 Tablas

**ingredient**
| Campo | Tipo | Notas |
|---|---|---|
| id | serial PK | |
| nombre | varchar, unique | ej. "papa" |
| unidad_base | enum('g','ml','unidad') | unidad canónica para sumar |

**unit_conversion**
| Campo | Tipo | Notas |
|---|---|---|
| id | serial PK | |
| ingredient_id | FK → ingredient | |
| unidad_origen | varchar | ej. "unidad", "taza" |
| factor_a_base | numeric | cuántas `unidad_base` equivale 1 `unidad_origen` |

> Ejemplo: ingredient "papa" (unidad_base = g), unit_conversion
> (unidad_origen="unidad", factor_a_base=150) → 1 papa ≈ 150 g.

**recipe**
| Campo | Tipo | Notas |
|---|---|---|
| id | serial PK | |
| nombre | varchar | |
| porciones_base | integer | para qué cantidad de gente rinden las cantidades cargadas |
| tipo_comida | enum('almuerzo','cena','ambos') | |
| tiempo_preparacion_min | integer, nullable | |
| instrucciones | text | pasos, texto libre o JSON de pasos |
| created_at | timestamp | |

**recipe_ingredient**
| Campo | Tipo | Notas |
|---|---|---|
| id | serial PK | |
| recipe_id | FK → recipe | |
| ingredient_id | FK → ingredient | |
| cantidad | numeric | en la unidad indicada, para `porciones_base` |
| unidad | varchar | unidad tal como se cargó (puede no ser la base) |

**meal_plan**
| Campo | Tipo | Notas |
|---|---|---|
| id | serial PK | |
| nombre | varchar, nullable | ej. "Semana del 21/7" |
| fecha_inicio | date | lunes de la semana |

**meal_plan_entry**
| Campo | Tipo | Notas |
|---|---|---|
| id | serial PK | |
| meal_plan_id | FK → meal_plan | |
| dia | enum('lunes'..'domingo') | |
| tipo_comida | enum('almuerzo','cena') | |
| recipe_id | FK → recipe, nullable | null = sin planificar ese día/comida |
| comensales | integer | cantidad de personas para ESTA entrada específica |

Constraint: unique (meal_plan_id, dia, tipo_comida) — una sola receta por
día/comida dentro de un plan.

## 3. Algoritmo de cálculo de lista de compras

Cumple User Story 3.1.

```
function generarListaDeCompras(meal_plan_id):
    entradas = meal_plan_entry WHERE meal_plan_id = meal_plan_id
                                AND recipe_id IS NOT NULL

    acumulador = {}  # key: (ingredient_id, unidad_base_o_no_convertible)

    for entrada in entradas:
        receta = recipe[entrada.recipe_id]
        factor = entrada.comensales / receta.porciones_base

        for ri in recipe_ingredient WHERE recipe_id = receta.id:
            conversion = buscar unit_conversion para
                         (ri.ingredient_id, ri.unidad)

            if conversion existe OR ri.unidad == ingredient.unidad_base:
                cantidad_en_base = convertir(ri.cantidad, ri.unidad,
                                              ingredient.unidad_base)
                key = (ri.ingredient_id, ingredient.unidad_base)
                acumulador[key] += cantidad_en_base * factor
            else:
                # no hay forma de convertir: no inventar equivalencia
                key = (ri.ingredient_id, ri.unidad)  # unidad original
                acumulador[key] += ri.cantidad * factor

    return formatear(acumulador)  # una línea por key
```

Notas de implementación:
- El factor se aplica ANTES de sumar, nunca después (evita error de
  redondeo acumulado).
- Si `porciones_base` es 0 o null, tratarlo como error de datos de la
  receta (no debería ocurrir si se valida al cargar la receta).
- Este cálculo se hace on-demand (no se persiste la lista de compras
  como tabla propia), así siempre refleja el estado actual del plan.

## 4. Contratos de API (REST)

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/recipes?q=milanesa | Buscar recetas por texto |
| GET | /api/recipes/:id | Detalle de una receta |
| POST | /api/recipes | Crear receta (con ingredientes anidados) |
| PUT | /api/recipes/:id | Editar receta |
| GET | /api/ingredients | Listar catálogo de ingredientes |
| POST | /api/ingredients | Crear ingrediente |
| POST | /api/ingredients/:id/conversions | Agregar factor de conversión |
| GET | /api/meal-plans | Listar historial de todos los planes semanales |
| POST | /api/meal-plans | Crear plan semanal (vacío o con entradas) |
| GET | /api/meal-plans/:id | Ver plan con sus entradas |
| POST | /api/meal-plans/:id/clone | Clonar/Duplicar un plan para otra semana con comensales |
| DELETE | /api/meal-plans/:id | Eliminar un plan de la base de datos |
| PUT | /api/meal-plans/:id/entries/:entryId | Asignar receta + comensales a un día/comida |
| GET | /api/meal-plans/:id/shopping-list | Calcular y devolver lista de compras (algoritmo de sección 3) |

---

## 4.1 UI Design System (Tema Claro & Pastel)

*   **Paleta de Colores**: Basada en colores pasteles y limpios con alto contraste para simular aplicaciones nativas de cocina:
    *   Fondo de App: `#f4f6f9` (pastel claro neutro).
    *   Tarjetas de contenido: `#ffffff` (blanco puro) con sombras `.shadow-premium` de tonalidades `#94a3b8` para un efecto de elevación suave.
    *   Bordes de separación: `#e2e8f0` (slate-200) para delimitar espacios sin recargar la pantalla.
    *   Color Primario: `#10b981` (verde esmeralda suave / menta).
*   **Agrupamiento de Lista de Compras**: Mapa estático de ingredientes en el cliente para agrupar en secciones (Verdulería, Carnicería, Lácteos, Panadería, etc.) facilitando el recorrido de compras del usuario.
*   **Detalles en Pestañas (Tabs)**: Navegación local en el modal de recetas dividiendo la información en "Ingredientes" (escalables dinámicamente) y "Preparación".

### Ejemplo de payload — PUT entry

```json
{
  "recipe_id": 12,
  "comensales": 5
}
```

### Ejemplo de respuesta — shopping-list

```json
{
  "items": [
    { "ingredient": "papa", "cantidad": 1800, "unidad": "g" },
    { "ingredient": "carne para milanesa", "cantidad": 6, "unidad": "unidad" }
  ],
  "no_convertibles": [
    { "ingredient": "sal", "cantidad": 2, "unidad": "pizca" }
  ]
}
```

## 5. Decisiones abiertas / a validar durante implementación

- ORM final: Prisma vs Sequelize (recomendación: Prisma).
- Formato de `instrucciones`: texto plano vs JSON de pasos estructurados
  (afecta si querés timers o UI paso a paso más adelante).
- Semilla inicial de datos: cargar manualmente ~20-30 recetas argentinas
  comunes antes de dar por terminado el MVP.
