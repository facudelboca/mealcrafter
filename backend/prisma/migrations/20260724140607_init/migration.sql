-- CreateEnum
CREATE TYPE "BaseUnit" AS ENUM ('g', 'ml', 'unidad');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('almuerzo', 'cena', 'ambos');

-- CreateEnum
CREATE TYPE "EntryMealType" AS ENUM ('almuerzo', 'cena');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');

-- CreateTable
CREATE TABLE "ingredient" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad_base" "BaseUnit" NOT NULL,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_conversion" (
    "id" SERIAL NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "unidad_origen" TEXT NOT NULL,
    "factor_a_base" DECIMAL(10,4) NOT NULL,

    CONSTRAINT "unit_conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porciones_base" INTEGER NOT NULL,
    "tipo_comida" "MealType" NOT NULL,
    "tiempo_preparacion_min" INTEGER,
    "instrucciones" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredient" (
    "id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,4) NOT NULL,
    "unidad" TEXT NOT NULL,

    CONSTRAINT "recipe_ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "fecha_inicio" DATE NOT NULL,

    CONSTRAINT "meal_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan_entry" (
    "id" SERIAL NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "dia" "DayOfWeek" NOT NULL,
    "tipo_comida" "EntryMealType" NOT NULL,
    "recipe_id" INTEGER,
    "comensales" INTEGER NOT NULL,

    CONSTRAINT "meal_plan_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_nombre_key" ON "ingredient"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "meal_plan_entry_meal_plan_id_dia_tipo_comida_key" ON "meal_plan_entry"("meal_plan_id", "dia", "tipo_comida");

-- AddForeignKey
ALTER TABLE "unit_conversion" ADD CONSTRAINT "unit_conversion_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_entry" ADD CONSTRAINT "meal_plan_entry_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_entry" ADD CONSTRAINT "meal_plan_entry_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
