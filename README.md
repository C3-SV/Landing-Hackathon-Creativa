# Todo suma · Festival de Código - I MVP

Base funcional en **Next.js App Router + TypeScript + Tailwind v4 + Firebase** para:

- Landing informativa (`/`)
- Registro por equipos 3H (`/register`)
- Panel admin por equipos (`/admin`)

## Stack

- Next.js 16.2.4 (App Router)
- React 19
- Tailwind CSS v4
- Firebase (`firebase`, `firebase-admin`)
- Formularios: `react-hook-form + zod`

## UI Kit aplicado

- Paleta oficial:
  - `#0A1F3D`, `#0D2D5E`, `#1A82FF`, `#FF6B00`, `#FFA726`, `#F8F9FA`, `#ADB5BD`, `#E65100`
- Tipografías:
  - `Press Start 2P` (headlines)
  - `JetBrains Mono` (labels, datos, métricas)
  - `Sora` (lectura continua)
- Tokens y estilos globales en [`app/globals.css`](app/globals.css)

## Variables de entorno

1. Copia `.env.example` a `.env.local`.
2. Ajusta valores según modo.

Variables clave:

- `DATA_MODE=mock|firebase`
- `SITE_LOCK_ENABLED=true|false` 
- `CURRENT_EDITION_ID`
- `ADMIN_EMAILS`
- `MOCK_ADMIN_PASSWORD` (solo mock)
- `NEXT_PUBLIC_FIREBASE_*` (cliente auth)
- `FIREBASE_*` (admin sdk)

## Modo mock (default)

Con `DATA_MODE=mock`:

- Seed interno de retos/edición/equipos demo.
- Registro y admin funcionan sin proyecto Firebase.
- Login admin usa `ADMIN_EMAILS` + `MOCK_ADMIN_PASSWORD`.
- Login temporal `/login` usa las mismas credenciales del admin.


## Modo Firebase

Con `DATA_MODE=firebase`:

- Lectura/escritura en Firestore.
- Session cookie admin validada con `firebase-admin`.
- Requiere `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

Seed opcional en Firebase real:

```bash
npm run seed:firebase
```

## Endpoints principales

- `GET /api/challenges`
- `GET /api/editions/current`
- `POST /api/registrations`
- `GET /api/admin/stats`
- `GET /api/admin/registrations`
- `GET /api/admin/registrations/[id]`
- `PATCH /api/admin/registrations/[id]`
- `GET /api/admin/registrations/export.csv`

## Correr local

```bash
npm install
npm run dev
```

Abrir: `http://localhost:3000`

Si Turbopack falla en entorno local (Windows), usa:

```bash
npm run dev
```

(`dev` ya está configurado con `--webpack` para estabilidad) y deja Turbopack opcional en:

```bash
npm run dev:turbo
```

## Estructura

- `app/` rutas, páginas y route handlers
- `features/landing` componentes de landing
- `features/register` formulario 3H por tabs
- `features/admin` dashboard/tabla/detalle/login
- `lib/repositories` capa de datos (`mock` + `firebase`)
- `lib/validation` schemas zod
- `lib/ui` sistema de componentes reusable
