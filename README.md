# MealCrafter — Planificador de Menús y Lista de Compras Inteligente

MealCrafter es una aplicación web full-stack diseñada para simplificar la planificación de comidas semanales y automatizar la generación de listas de compras consolidadas. A través de un catálogo dinámico y un motor inteligente de conversión de unidades, la aplicación unifica cantidades de diferentes recetas y las escala según el número de comensales en tiempo real.

Adicionalmente, cuenta con un buscador e importador de recetas web que las traduce semánticamente al español y normaliza sus unidades de cocina de manera automática.

---

## 🚀 Características Principales

### 📅 Planificación de Menús Semanales
*   Grilla de 7 días × 2 comidas diarias (Almuerzo y Cena).
*   Configuración dinámica de comensales por plato con escalado automático de porciones.
*   Interacciones fluidas e instantáneas gracias a una arquitectura Single Page Application (SPA).

### 🛒 Generación y Consolidación de Lista de Compras
*   Suma inteligente de ingredientes de diferentes recetas.
*   Motor de conversión de unidades que unifica medidas volumétricas (tazas, cucharadas, cucharaditas a `ml`) y de peso (kilos a `g`) para evitar líneas duplicadas.
*   Sección de control para marcar los ítems que ya vas agregando al changuito de compras (guardado en LocalStorage).

### 🌐 Buscador e Importador de Recetas Web
*   Integración directa con el catálogo público **TheMealDB API**.
*   Buscador case-insensitive con soporte de términos en español.
*   **Vista previa detallada en español**: permite inspeccionar ingredientes y pasos traducidos antes de guardarla.
*   Traductor gastronómico por lotes que optimiza las consultas y evita bloqueos de rate-limit.
*   Filtro corrector de traducción literal (reemplaza automáticamente modismos raros, ej: *drumsticks* -> *patas de pollo*, *sticky chicken* -> *pollo glaseado*).
*   Módulo de reparación automática de base de datos para ingredientes cargados sin conversión o con unidades base obsoletas.

### 🛡️ Autenticación y Seguridad
*   Registro e inicio de sesión de usuarios con contraseñas encriptadas.
*   Manejo de sesiones seguro del lado del servidor mediante tokens HTTP-Only (Cookies).

### 🎨 Experiencia de Usuario Premium (UI/UX)
*   Diseño responsive elegante y adaptable a celulares, tablets y computadoras.
*   Alineación estética moderna basada en *glassmorphism* y micro-interacciones de hover.
*   Soporte nativo de Tema Claro y Tema Oscuro.

---

## 🛠️ Stack Tecnológico

*   **Frontend**: React (Vite), Vanilla CSS (diseño responsive premium), SVG para iconos.
*   **Backend**: Node.js, Express.js.
*   **Base de Datos y ORM**: PostgreSQL (Supabase en producción), Prisma ORM.
*   **Testing**: Vitest (Unit y API Integration Tests), Supertest.
*   **Infraestructura**: Vercel (Hosting estático y Serverless Functions), Supabase (Base de datos en la nube), Docker (PostgreSQL local), GitHub Actions (CI Pipeline).

---

## 📂 Estructura del Proyecto

*   `backend/`: Contiene el código de la API Express, modelos de Prisma, controladores de rutas, servicios de importación y la suite de pruebas.
*   `frontend/`: Código fuente de la aplicación React estructurado en componentes de interfaz reutilizables.
*   `api/`: Wrappers serverless y punto de entrada optimizado para el despliegue del backend en Vercel.

---

## 💻 Instalación y Configuración Local

### Requisitos Previos
*   Node.js (versión 20 o superior recomendado).
*   Docker y Docker Compose (opcional, para levantar la base de datos).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/facudelboca/mealcrafter.git
cd mealcrafter
```

### Paso 2: Levantar la Base de Datos (PostgreSQL)
Si contás con Docker, podés levantar el contenedor local corriendo:
```bash
docker-compose up -d
```
Esto inicializará una base de datos PostgreSQL en el puerto `5433`.

### Paso 3: Configurar Variables de Entorno
Crea un archivo `.env` dentro de la carpeta `backend/` con los siguientes datos:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/mealcrafter?schema=public"
SESSION_SECRET="tu_clave_secreta_super_segura"
PORT=3000
```

Y en la carpeta `frontend/` crea un archivo `.env.local` con:
```env
VITE_API_URL=http://localhost:3000
```

### Paso 4: Inicializar Base de Datos y Semilla
Dentro de la carpeta `backend/`, ejecuta las migraciones de Prisma y el script de población inicial (seed) para precargar los ingredientes y recetas básicas de prueba:
```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
```

### Paso 5: Correr la Aplicación en Desarrollo
Levantar el backend (en la carpeta `backend/`):
```bash
npm run dev
```

Levantar el frontend (en una nueva terminal en la carpeta `frontend/`):
```bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible para usar en `http://localhost:5173`.

---

## 🧪 Pruebas Automatizadas

La aplicación cuenta con una suite completa de pruebas unitarias y de integración que verifican la creación de planes, cálculo matemático de porciones de compra, autenticación y flujos de importación externa.

Para ejecutar los tests, sitúate en la carpeta `backend/` y corre:
```bash
npm run test
```
