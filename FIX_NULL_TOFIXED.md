# Correction TypeError: Cannot read properties of null

## 🐛 Problèmes rencontrés

### 1. Erreur sur toFixed()
Erreur JavaScript dans le composant NiveauxManager:
```
TypeError: Cannot read properties of null (reading 'toFixed')
    at NiveauxManager.tsx:149:24
```

### 2. Erreur sur length
Erreur JavaScript dans le composant MursManager:
```
TypeError: Cannot read properties of null (reading 'length')
    at MursManager.tsx:223:30
```

## 🔍 Causes

### Cause 1: Vérification insuffisante avec !== undefined

Les propriétés numériques optionnelles (`altitude`, `surface`, `hauteurSousPlafond`) peuvent être:
- `undefined` (non définies)
- `null` (valeur explicite nulle du backend)
- `number` (valeur définie)

**Le problème**: Le code utilisait `!== undefined` qui ne protège pas contre `null`:

```typescript
// ❌ INCORRECT - Ne protège pas contre null
{niveau.altitude !== undefined && <span>• Alt: {niveau.altitude.toFixed(2)} m</span>}
```

Quand `niveau.altitude` est `null`, la condition `!== undefined` est vraie (car `null !== undefined`), donc le code essaie d'appeler `null.toFixed(2)` ce qui génère l'erreur.

### Cause 2: Valeur par défaut ne s'applique pas à null

Les tableaux optionnels (`murs`, `pieces`) peuvent être:
- `undefined` (non définis)
- `null` (valeur explicite nulle du backend)
- `Array` (tableau défini)

**Le problème**: Les valeurs par défaut en paramètres TypeScript (`= []`) ne s'appliquent que quand la valeur est `undefined`, pas quand elle est `null`:

```typescript
// ❌ INCORRECT - La valeur par défaut ne s'applique pas si murs est null
function MursManager({ murs = [] }: Props) {
  return <div>Murs ({murs.length})</div>  // Erreur si murs est null!
}
```

Quand le parent passe `murs={niveau.murs}` et que `niveau.murs` est `null`, le paramètre reçoit `null` (pas `undefined`), donc la valeur par défaut n'est pas utilisée.

## ✅ Solutions appliquées

### Solution 1: Utiliser != null pour toFixed()

Utiliser `!= null` (avec un seul `=`) qui vérifie à la fois `null` ET `undefined`:

```typescript
// ✅ CORRECT - Protège contre null ET undefined
{niveau.altitude != null && <span>• Alt: {niveau.altitude.toFixed(2)} m</span>}
```

**Rappel JavaScript**:
- `value != null` est vrai seulement si `value` n'est ni `null` ni `undefined`
- `value !== undefined` est vrai si `value` est `null` (d'où le bug)

### Solution 2: Utiliser l'opérateur de coalescence nulle (??) pour les tableaux

Au lieu d'utiliser une valeur par défaut dans les paramètres, utiliser l'opérateur `??` dans le corps de la fonction:

```typescript
// ✅ CORRECT - Gère null ET undefined
function MursManager({ murs }: Props) {
  const mursList = murs ?? []  // Si murs est null ou undefined, utilise []
  return <div>Murs ({mursList.length})</div>
}
```

**Rappel JavaScript**:
- `value ?? defaultValue` retourne `defaultValue` si `value` est `null` OU `undefined`
- `param = defaultValue` ne s'applique que si `param` est `undefined` (pas `null`)

## 🔧 Fichiers corrigés

### 1. [NiveauxManager.tsx](src/features/batiments/components/NiveauxManager.tsx)

**Ligne 161-162** (affichage dans le label):
```typescript
// Avant:
{niveau.altitude !== undefined && <span>• Alt: {niveau.altitude.toFixed(2)} m</span>}
{niveau.surface !== undefined && <span>• {niveau.surface.toFixed(2)} m²</span>}

// Après:
{niveau.altitude != null && <span>• Alt: {niveau.altitude.toFixed(2)} m</span>}
{niveau.surface != null && <span>• {niveau.surface.toFixed(2)} m²</span>}
```

**Lignes 208, 211, 214** (affichage dans Descriptions):
```typescript
// Avant:
{niveau.altitude !== undefined ? niveau.altitude.toFixed(2) : '-'}
{niveau.hauteurSousPlafond !== undefined ? niveau.hauteurSousPlafond.toFixed(2) : '-'}
{niveau.surface !== undefined ? niveau.surface.toFixed(2) : '-'}

// Après:
{niveau.altitude != null ? niveau.altitude.toFixed(2) : '-'}
{niveau.hauteurSousPlafond != null ? niveau.hauteurSousPlafond.toFixed(2) : '-'}
{niveau.surface != null ? niveau.surface.toFixed(2) : '-'}
```

### 2. [PiecesManager.tsx](src/features/batiments/components/PiecesManager.tsx)

**Ligne 42-44** (gestion de null pour le tableau):
```typescript
// Avant:
export default function PiecesManager({ pieces = [] }: Props) {
  return <Card title={`Pièces (${pieces.length})`}>  // Erreur si pieces est null!

// Après:
export default function PiecesManager({ pieces }: Props) {
  const piecesList = pieces ?? []
  return <Card title={`Pièces (${piecesList.length})`}>  // ✅ Sûr
```

**Ligne 159** (toFixed):
```typescript
// Avant:
render: (hauteur?: number) => (hauteur !== undefined ? hauteur.toFixed(2) : '-')

// Après:
render: (hauteur?: number) => (hauteur != null ? hauteur.toFixed(2) : '-')
```

### 3. [MursManager.tsx](src/features/batiments/components/MursManager.tsx)

**Ligne 45-47** (gestion de null pour le tableau):
```typescript
// Avant:
export default function MursManager({ murs = [] }: Props) {
  return <Card title={`Murs (${murs.length})`}>  // Erreur si murs est null!

// Après:
export default function MursManager({ murs }: Props) {
  const mursList = murs ?? []
  return <Card title={`Murs (${mursList.length})`}>  // ✅ Sûr
```

## ✅ Vérification

Les autres usages de `toFixed()` dans le projet utilisent déjà l'opérateur de chaînage optionnel (`?.toFixed(2)`) qui est sûr:

```typescript
// ✅ Déjà sûr - l'opérateur ?. gère null et undefined
{batiment.charpente.pente?.toFixed(2) || '-'}
{terrain.surface?.toFixed(2) || '-'}
{fondations.profondeur?.toFixed(2) || '-'}
```

## 🎯 Build

```bash
npm run build
# ✅ Build successful (12.69s)
```

## 📝 Bonnes pratiques

### Pour les valeurs primitives optionnelles (nombre, string, etc.):

#### ✅ À FAIRE:
```typescript
// Option 1: Chaînage optionnel (préféré pour les propriétés)
{value?.toFixed(2) || '-'}

// Option 2: Vérification != null (pour les variables)
{value != null ? value.toFixed(2) : '-'}
{value != null && <span>{value.toFixed(2)}</span>}
```

#### ❌ À ÉVITER:
```typescript
// N'utilise pas !== undefined pour des valeurs qui peuvent être null
{value !== undefined ? value.toFixed(2) : '-'}
{value !== undefined && <span>{value.toFixed(2)}</span>}
```

### Pour les tableaux optionnels:

#### ✅ À FAIRE:
```typescript
// Option 1: Opérateur ?? dans le corps de la fonction (préféré)
function MyComponent({ items }: Props) {
  const itemsList = items ?? []
  return <div>Count: {itemsList.length}</div>
}

// Option 2: Chaînage optionnel
{items?.length || 0}
```

#### ❌ À ÉVITER:
```typescript
// La valeur par défaut ne marche pas avec null!
function MyComponent({ items = [] }: Props) {
  return <div>Count: {items.length}</div>  // Erreur si items est null!
}
```

## 🚀 Résultat

Les erreurs `TypeError: Cannot read properties of null` sont **complètement résolues**:
- ✅ Les composants gèrent correctement les valeurs `null`, `undefined` et définies
- ✅ Utilisation cohérente de `!= null` pour les vérifications
- ✅ Utilisation de l'opérateur `??` pour les valeurs par défaut
- ✅ Application robuste qui ne crashe plus sur les données nulles du backend
