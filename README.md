# DCB Frontend - React Application

Application web React pour la gestion des devis de construction de bâtiments (DCB).

## Technologies Utilisées

- **React 18** avec **TypeScript**
- **Vite** - Build tool moderne et rapide
- **Ant Design 5** - Bibliothèque de composants UI
- **TanStack Query (React Query)** - Gestion de l'état serveur
- **Zustand** - Gestion de l'état client
- **React Hook Form + Zod** - Gestion des formulaires et validation
- **Axios** - Client HTTP
- **React Router v6** - Navigation
- **Three.js + React Three Fiber** - Visualisation 3D (à venir)

## Prérequis

- Node.js 20.19+ ou 22.12+ (actuellement testé avec Node.js 22.2.0)
- npm 9.4+
- Backend DCB lancé sur http://localhost:8080

## Installation

\`\`\`bash
cd dcb-front-react
npm install
\`\`\`

## Configuration

Le projet utilise des fichiers d'environnement :

**Développement** (`.env.development`) :
\`\`\`env
VITE_API_URL=http://localhost:8080/api
\`\`\`

**Production** (`.env.production`) :
\`\`\`env
VITE_API_URL=https://api.dcb.example.com/api
\`\`\`

## Lancement

### Mode Développement

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur **http://localhost:5173**

### Build Production

\`\`\`bash
npm run build
\`\`\`

### Prévisualisation du Build

\`\`\`bash
npm run preview
\`\`\`

## Structure du Projet

\`\`\`
dcb-front-react/
├── src/
│   ├── api/                      # Couche API
│   │   ├── client.ts             # Client Axios
│   │   ├── query-client.ts       # Config React Query
│   │   ├── query-keys.ts         # Query keys
│   │   ├── endpoints/            # API endpoints
│   │   └── types/                # Types TypeScript
│   ├── components/layout/        # Layout components
│   ├── features/batiments/       # Feature Bâtiments
│   ├── routes/                   # Routing
│   ├── store/                    # Zustand stores
│   └── App.tsx
├── .env.development
├── vite.config.ts
├── tsconfig.json
└── package.json
\`\`\`

## Fonctionnalités

### ✅ Phase 1 - Infrastructure Complète

- Projet Vite + React + TypeScript
- Configuration complète (Vite, TypeScript, environnement)
- Client API Axios avec intercepteurs
- Types TypeScript complets pour les modèles backend
- Endpoints API (bâtiments, niveaux, éléments)
- React Query configuré
- Layout Ant Design (Header, Sidebar)
- Routing avec React Router v6
- Store Zustand pour l'UI

### 🚧 À Venir

- Liste des bâtiments avec pagination et filtres
- Formulaires de création/édition
- Gestion des niveaux et pièces
- Visualisation 3D avec Three.js
- Validation métier intégrée

## API Backend

Le backend doit être lancé avant le frontend :

\`\`\`bash
cd dcb-backend
./gradlew bootRun
\`\`\`

Vérifier l'API :
\`\`\`bash
curl http://localhost:8080/api/batiments
\`\`\`

## Développement

### Alias de Chemins

Le projet utilise `@/` pour référencer le dossier `src/` :

\`\`\`typescript
import { batimentsApi } from '@/api/endpoints/batiments'
\`\`\`

### React Query DevTools

Disponibles en mode développement (icône en bas à gauche).

### Ant Design

Interface en français avec locale `fr_FR`.

## Scripts

\`\`\`bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
\`\`\`

## Licence

Propriétaire - DCB Project
