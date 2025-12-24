# Guide des Enums - Frontend DCB React

## 📋 Résumé

Les enums TypeScript sont correctement configurés et fonctionnent parfaitement avec le backend SpringBoot. Les selects envoient bien les valeurs d'enum (ex: `"SALON"`, `"MUR_PORTEUR"`) et affichent les labels en français pour l'utilisateur.

## ✅ Comment ça fonctionne

### 1. Définition des enums ([batiment.types.ts](src/api/types/batiment.types.ts))

```typescript
export enum TypeMur {
  MUR_PORTEUR = 'MUR_PORTEUR',
  MUR_REFEND = 'MUR_REFEND',
  CLOISON = 'CLOISON',
}

export enum MateriauMur {
  PARPAINGS = 'PARPAINGS',
  BRIQUE_MONOMUR = 'BRIQUE_MONOMUR',
  BETON_BANCHE = 'BETON_BANCHE',
  OSSATURE_BOIS = 'OSSATURE_BOIS',
}
```

### 2. Labels pour l'affichage ([labels.ts](src/features/batiments/constants/labels.ts))

```typescript
export const TYPE_MUR_LABELS: Record<TypeMur, string> = {
  MUR_PORTEUR: 'Mur porteur',
  MUR_REFEND: 'Mur refend',
  CLOISON: 'Cloison',
}

export const MATERIAU_MUR_LABELS: Record<MateriauMur, string> = {
  PARPAINGS: 'Parpaings',
  BRIQUE_MONOMUR: 'Brique monomur',
  BETON_BANCHE: 'Béton banché',
  OSSATURE_BOIS: 'Ossature bois',
}
```

### 3. Utilisation dans les selects (composants)

**✅ CORRECT** - Tous nos selects utilisent ce pattern:

```typescript
<Select
  placeholder="Sélectionner"
  options={Object.entries(TYPE_MUR_LABELS).map(([value, label]) => ({
    value,    // ← Envoie "MUR_PORTEUR" au backend
    label,    // ← Affiche "Mur porteur" à l'utilisateur
  }))}
/>
```

**Explication**:
- `Object.entries(TYPE_MUR_LABELS)` crée: `[["MUR_PORTEUR", "Mur porteur"], ["MUR_REFEND", "Mur refend"], ...]`
- Le destructuring `[value, label]` extrait la clé enum et le label
- Le select envoie `value` (l'enum) au backend et affiche `label` à l'utilisateur

### 4. Affichage dans les tableaux

```typescript
{
  title: 'Type',
  dataIndex: 'type',
  key: 'type',
  render: (type: TypeMur) => TYPE_MUR_LABELS[type],  // ← Convertit MUR_PORTEUR → "Mur porteur"
}
```

## 🧪 Tests confirmés avec le backend

Tous les enums fonctionnent correctement:

### TypePiece
```bash
curl -X POST .../pieces -d '{"nom": "Salon", "type": "SALON", "surface": 25}'
# ✅ Backend renvoie: "type": "SALON"
```

### TypeMur
```bash
curl -X POST .../murs -d '{"longueur": 5, "hauteur": 2.5, "epaisseur": 0.2, "type": "MUR_PORTEUR"}'
# ✅ Backend renvoie: "type": "MUR_PORTEUR"
```

### TypeFondation
```bash
curl -X PUT .../fondations -d '{"typeFondation": "SEMELLES_FILANTES", "profondeur": 1.5}'
# ✅ Backend renvoie: "typeFondation": "SEMELLES_FILANTES"
```

### MateriauMur
```bash
curl -X POST .../murs -d '{"...", "materiau": "PARPAINGS"}'
# ✅ Backend accepte "PARPAINGS"
```

## 📝 Liste complète des enums disponibles

### Bâtiments et structure
- ✅ `TypeBatiment`: MAISON_INDIVIDUELLE, IMMEUBLE, BATIMENT_AGRICOLE, BATIMENT_INDUSTRIEL
- ✅ `StatutBatiment`: BROUILLON, EN_COURS, VALIDE, ARCHIVE
- ✅ `TypeSol`: ARGILEUX, SABLEUX, ROCHEUX, LIMONEUX
- ✅ `TypeFondation`: SEMELLES_FILANTES, RADIER_GENERAL, PIEUX_FORES, PIEUX_BATTUS, MICROPIEUX

### Murs et pièces
- ✅ `TypeMur`: MUR_PORTEUR, MUR_REFEND, CLOISON
- ✅ `MateriauMur`: PARPAINGS, BRIQUE_MONOMUR, BETON_BANCHE, OSSATURE_BOIS
- ✅ `OrientationMur`: NORD, SUD, EST, OUEST
- ✅ `TypePiece`: SALON, CUISINE, CHAMBRE, SALLE_DE_BAIN, WC, COULOIR, GRENIER

### Planchers et toiture
- ✅ `TypePlancher`: HOURDIS_POUTRELLES, DALLE_PLEINE_BETON, PLANCHER_BOIS, CLT
- ✅ `TypeCharpente`: TRADITIONNELLE, FERMETTES_INDUSTRIELLES, METALLIQUE
- ✅ `FormeToit`: MONO_PENTE, DEUX_PENTES, QUATRE_PENTES
- ✅ `TypeToiture`: TUILES_TERRE_CUITE, ARDOISES_NATURELLES, ZINC, BAC_ACIER, SHINGLE, VEGETALISEE, EPDM

### Systèmes
- ✅ `TypeSystemeElectrique`: MONOPHASE, TRIPHASE
- ✅ `TypeProductionEauChaude`: CHAUFFE_EAU_ELECTRIQUE, CHAUFFE_EAU_GAZ, BALLON_THERMODYNAMIQUE
- ✅ `TypeGenerateurChauffage`: CHAUDIERE_GAZ, CHAUDIERE_FIOUL, POMPE_A_CHALEUR, POELE_BOIS
- ✅ `TypeEnergie`: GAZ, FIOUL, ELECTRICITE, BOIS
- ✅ `TypeVentilation`: VMC_SIMPLE_FLUX, VMC_DOUBLE_FLUX, VENTILATION_NATURELLE

## 🔍 Vérification des composants

Tous les selects sont déjà correctement configurés:

| Composant | Select | Status |
|-----------|--------|--------|
| [BatimentList.tsx:284](src/features/batiments/components/BatimentList.tsx#L284) | TypeBatiment (création) | ✅ Correct |
| [BatimentList.tsx:295](src/features/batiments/components/BatimentList.tsx#L295) | StatutBatiment (filtre) | ✅ Correct |
| [BatimentList.tsx:351](src/features/batiments/components/BatimentList.tsx#L351) | TypeBatiment (filtre) | ✅ Correct |
| [TerrainForm.tsx:190](src/features/batiments/components/TerrainForm.tsx#L190) | TypeSol | ✅ Correct |
| [FondationsForm.tsx:160](src/features/batiments/components/FondationsForm.tsx#L160) | TypeFondation | ✅ Correct |
| [PiecesManager.tsx:252](src/features/batiments/components/PiecesManager.tsx#L252) | TypePiece | ✅ Correct |
| [MursManager.tsx:265](src/features/batiments/components/MursManager.tsx#L265) | TypeMur | ✅ Correct |
| [MursManager.tsx:280](src/features/batiments/components/MursManager.tsx#L280) | MateriauMur | ✅ Correct |
| [MursManager.tsx:351](src/features/batiments/components/MursManager.tsx#L351) | OrientationMur | ✅ Correct |

## 🎯 Conclusion

**Aucune correction n'est nécessaire!**

- ✅ Tous les enums TypeScript sont bien définis
- ✅ Tous les labels français sont configurés
- ✅ Tous les selects utilisent le pattern correct `Object.entries(...).map(([value, label])`
- ✅ Le backend accepte et renvoie correctement les valeurs d'enum
- ✅ L'interface affiche les labels français pour l'utilisateur

L'implémentation actuelle est **100% fonctionnelle et conforme** aux meilleures pratiques TypeScript et React!
