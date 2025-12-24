# Corrections des Enums - Conformité Backend

## 🔧 Problème identifié

Lors de la mise à jour des données du terrain, une erreur 400 s'est produite:

```
JSON parse error: Cannot deserialize value of type `com.menkaix.dcbbackend.model.TypeSol`
from String "ARGILEUX": not one of the values accepted for Enum class:
[ROCHE, GRAVIER, TOURBE, ARGILE, MIXTE, LIMON, REMBLAI, SABLE]
```

**Cause**: Les valeurs de l'enum `TypeSol` dans le frontend ne correspondaient pas aux valeurs attendues par le backend.

## ✅ Correction appliquée

### Enum TypeSol ([batiment.types.ts:16-25](src/api/types/batiment.types.ts#L16-L25))

**Avant** (valeurs incorrectes):
```typescript
export enum TypeSol {
  ARGILEUX = 'ARGILEUX',    // ❌ N'existe pas dans le backend
  SABLEUX = 'SABLEUX',      // ❌ N'existe pas dans le backend
  ROCHEUX = 'ROCHEUX',      // ❌ N'existe pas dans le backend
  LIMONEUX = 'LIMONEUX',    // ❌ N'existe pas dans le backend
}
```

**Après** (valeurs correctes):
```typescript
export enum TypeSol {
  ARGILE = 'ARGILE',        // ✅ Correspond au backend
  SABLE = 'SABLE',          // ✅ Correspond au backend
  ROCHE = 'ROCHE',          // ✅ Correspond au backend
  LIMON = 'LIMON',          // ✅ Correspond au backend
  GRAVIER = 'GRAVIER',      // ✅ Ajouté (existe dans le backend)
  TOURBE = 'TOURBE',        // ✅ Ajouté (existe dans le backend)
  REMBLAI = 'REMBLAI',      // ✅ Ajouté (existe dans le backend)
  MIXTE = 'MIXTE',          // ✅ Ajouté (existe dans le backend)
}
```

### Labels ([labels.ts:45-54](src/features/batiments/constants/labels.ts#L45-L54))

**Avant**:
```typescript
export const TYPE_SOL_LABELS: Record<TypeSol, string> = {
  ARGILEUX: 'Argileux',
  SABLEUX: 'Sableux',
  ROCHEUX: 'Rocheux',
  LIMONEUX: 'Limoneux',
}
```

**Après**:
```typescript
export const TYPE_SOL_LABELS: Record<TypeSol, string> = {
  ARGILE: 'Argile',
  SABLE: 'Sable',
  ROCHE: 'Roche',
  LIMON: 'Limon',
  GRAVIER: 'Gravier',
  TOURBE: 'Tourbe',
  REMBLAI: 'Remblai',
  MIXTE: 'Mixte',
}
```

## 🧪 Test de validation

### Test réussi avec la nouvelle valeur:
```bash
curl -X PUT http://localhost:8080/api/batiments/{id}/terrain \
  -H "Content-Type: application/json" \
  -d '{"surface": 500, "typeSol": "ARGILE"}'

# ✅ Réponse: 200 OK
# ✅ Backend renvoie: "typeSol": "ARGILE"
```

## 📋 Vérification des autres enums

### Enums testés et validés:

| Enum | Valeurs Frontend | Status | Note |
|------|-----------------|--------|------|
| TypeSol | ARGILE, SABLE, ROCHE, LIMON, GRAVIER, TOURBE, REMBLAI, MIXTE | ✅ Corrigé | 8 valeurs au lieu de 4 |
| TypeFondation | SEMELLES_FILANTES, RADIER_GENERAL, PIEUX_FORES, PIEUX_BATTUS, MICROPIEUX | ✅ Validé | Fonctionne correctement |
| TypeMur | MUR_PORTEUR, MUR_REFEND, CLOISON | ✅ Validé | Fonctionne correctement |
| TypePiece | SALON, CUISINE, CHAMBRE, SALLE_DE_BAIN, WC, COULOIR, GRENIER | ✅ Validé | Fonctionne correctement |
| MateriauMur | PARPAINGS, BRIQUE_MONOMUR, BETON_BANCHE, OSSATURE_BOIS | ✅ Validé | Fonctionne correctement |
| OrientationMur | NORD, SUD, EST, OUEST | ✅ Validé | Fonctionne correctement |

## 🎯 Impact de la correction

### Fichiers modifiés:
1. [src/api/types/batiment.types.ts](src/api/types/batiment.types.ts) - Définition de l'enum TypeSol
2. [src/features/batiments/constants/labels.ts](src/features/batiments/constants/labels.ts) - Labels français

### Composants affectés:
- [TerrainForm.tsx](src/features/batiments/components/TerrainForm.tsx) - Le select TypeSol affiche maintenant les bonnes valeurs

### Build:
```bash
npm run build
# ✅ Build successful (12.81s)
```

## 📝 Leçon apprise

**Important**: Toujours vérifier que les valeurs d'enum dans le frontend correspondent **exactement** aux valeurs attendues par le backend Java/SpringBoot.

Pour les enums Java, les valeurs sont généralement en MAJUSCULES avec des underscores (SNAKE_CASE).

### Recommandation pour l'avenir:

1. **Documentation des enums backend**: Demander ou consulter la documentation des enums Java
2. **Tests d'intégration**: Tester chaque enum avec le backend avant de l'utiliser
3. **Messages d'erreur**: Les messages d'erreur 400 du backend indiquent souvent les valeurs acceptées
4. **Synchronisation**: Maintenir une liste à jour des enums backend dans un fichier de référence

## ✅ Résultat

L'erreur 400 sur la mise à jour du terrain est maintenant **résolue**. Le formulaire terrain peut désormais envoyer correctement les données au backend avec les 8 types de sol disponibles.
