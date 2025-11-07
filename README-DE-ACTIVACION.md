# Restaurante MVC — Guía de instalación y arranque (Backend y Frontend)

Este documento explica cómo instalar dependencias, configurar variables y poner en marcha el backend (Express + Supabase) y el frontend (React + Vite) en entorno local.

## Requisitos
- Node.js `>= 18` y `npm` `>= 9`.
- Cuenta y proyecto en Supabase (URL y Service Role Key).
- Buckets de almacenamiento en Supabase: `avatars` y `menu-images` (para subir avatares y fotos de platos).

## Estructura del proyecto
```
MVC/
├── backend/     # API Express, integración con Supabase
├── frontend/    # React + Vite, cliente web
└── insights/    # Material de análisis (p.ej., tradeoffs)
```

---

## Backend (Express + Supabase)

1) Instalar dependencias
```
cd backend
npm install
```

2) Configurar variables de entorno (`backend/.env`)
Copie y complete este ejemplo:
```
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
SUPABASE_DB_SCHEMA=public

# JWT para autenticación
JWT_SECRET=una_clave_segura_para_tokens
```

3) (Opcional) Sembrar categorías y menú de ejemplo
```
npm run seed:menu
```

4) Arrancar el servidor
```
npm run dev
```
- Escucha en `http://localhost:3001` (puerto configurable vía `PORT`).
- Healthcheck: `GET http://localhost:3001/api/health`.

### Endpoints principales
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/change-password`.
- Menú: `GET /api/menu`, `GET /api/menu/categorias`, `GET /api/menu/especiales`.
- Sedes: `GET /api/sedes` (público), `POST/PUT/DELETE /api/sedes` (admin).
- Mesas: `GET /api/mesas? s ede=...&piso=...`, `GET /api/mesas/pisos?sede=...`.
- Reservas: `POST /api/reservas` (usuario), `GET /api/reservas` (admin), `GET /api/reservas/mine` (usuario).

Notas:
- Subida de imágenes: requiere buckets `avatars` y `menu-images` en Supabase Storage.
- Autorización: los endpoints protegidos requieren `Authorization: Bearer <token>`.

---

## Frontend (React + Vite)

1) Instalar dependencias
```
cd ../frontend
npm install
```

2) Configurar API base (`frontend/.env.local`)
Cree `frontend/.env.local` con:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

3) Arrancar el cliente
```
npm run dev
```
- Se abre en `http://localhost:5173/` (si está ocupado, Vite usará otro puerto p.ej. `5174`).
- Página de análisis local y visualizaciones: `http://localhost:5173/tradeoffs/index.html`.

4) Construir y previsualizar
```
npm run build
npm run preview
```

---

## Puesta en marcha conjunta
- Abra dos terminales:
  - Terminal A: `cd backend && npm run dev`
  - Terminal B: `cd frontend && npm run dev`
- Verifique `GET http://localhost:3001/api/health` antes de usar el frontend.

---

## Solución de problemas
- Vite mueve el puerto (5173 → 5174): no afecta a la API; mantenga `VITE_API_BASE_URL` apuntando a `http://localhost:3001/api`.
- CORS: el backend usa `cors({ origin: '*', credentials: true })`. Si personaliza dominios, ajuste `origin`.
- Credenciales Supabase faltantes: revise `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env` del backend.
- JWT ausente: configure `JWT_SECRET` o los endpoints protegidos devolverán `401`.
- Buckets de Storage: cree `avatars` y `menu-images` para evitar errores al subir imágenes.

---

## Información útil
- El cliente usa `LocalStorage` clave `jwt` para el token (ver `frontend/src/services/apiService.js`).
- El backend desactiva `ETag` para evitar respuestas `304` que complican `fetch` en local.
- Los paneles de administración están bajo rutas `/admin/*`; usuario bajo `/usuario/*`.

---

## Comandos rápidos
```
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# Semilla de menú (opcional)
cd backend && npm run seed:menu
```