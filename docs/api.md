# API QueenBee v0 : contrat

Base : `http://localhost:4000`. Toutes les réponses sont en JSON. Les données sont gardées en mémoire (perdues à l'arrêt du serveur).

## Conventions

### Identifiants
- Ruche : chaîne `PAYS-SITE-NNN`, par exemple `SN-CASA-001`.
- Inspection : UUID choisi par l'application mobile (pas par le serveur).

### Dates
Format ISO 8601 en UTC, par exemple `2026-10-31T10:00:00Z`.

### Format des erreurs (RFC 9457)
Toute erreur est renvoyée avec l'en-tête `Content-Type: application/problem+json` et ce corps :

```json
{
  "type": "about:blank",
  "title": "Requête invalide",
  "status": 400,
  "detail": "Le paramètre limit doit être un entier compris entre 1 et 500."
}
```

- `title` est l'intitulé du code, le même pour toutes les erreurs de ce code.
- `detail` explique ce qui s'est passé pour cette requête.
- Une réponse d'erreur ne contient jamais de pile d'exécution ni de message SQL.

| Code | title |
| --- | --- |
| 400 | Requête invalide |
| 404 | Ressource introuvable |
| 409 | Conflit |
| 500 | Erreur interne |

### Erreurs transversales
Valables pour toutes les routes :

- **404** : aucune route ne correspond à la méthode et à l'URL demandées.
- **400** : corps de requête qui n'est pas un JSON valide.
- **500** : erreur interne non prévue.

Exemple 404 (route inconnue) :

```json
{
  "type": "about:blank",
  "title": "Ressource introuvable",
  "status": 404,
  "detail": "Aucune route ne correspond à GET /api/inconnu."
}
```

---

## 1. GET /health

Vérifie que le serveur répond.

**Paramètres** : aucun.

**Codes**
- 200 : le serveur fonctionne.

**Exemple 200**

```json
{ "status": "ok" }
```

---

## 2. GET /api/hives

Liste des ruches, avec filtre facultatif par site.

**Paramètres de requête**
- `site_id` : chaîne, facultatif (par exemple `SN-CASA`). Si absent ou vide, toutes les ruches sont renvoyées. Sinon, seules les ruches de ce site. Un site inconnu donne une liste vide, pas une erreur.

**Codes**
- 200 : liste des ruches (éventuellement vide).

**Exemple 200** (`GET /api/hives?site_id=SN-CASA`)

```json
[
  { "id": "SN-CASA-001", "site_id": "SN-CASA", "status": "active" },
  { "id": "SN-CASA-002", "site_id": "SN-CASA", "status": "active" }
]
```

**Exemple d'erreur** : cette route n'a pas de cas d'erreur propre (voir les erreurs transversales).

---

## 3. GET /api/hives/:id

Détail d'une ruche.

**Paramètres de chemin**
- `id` : identifiant de la ruche (par exemple `SN-CASA-001`).

**Codes**
- 200 : la ruche demandée.
- 404 : aucune ruche ne porte cet identifiant.

**Exemple 200**

```json
{ "id": "SN-CASA-001", "site_id": "SN-CASA", "status": "active" }
```

**Exemple 404** (`GET /api/hives/XX-NOPE-999`)

```json
{
  "type": "about:blank",
  "title": "Ressource introuvable",
  "status": 404,
  "detail": "La ruche XX-NOPE-999 n'existe pas."
}
```

---

## 4. POST /api/hives/:id/measures

Enregistre une mesure envoyée par la passerelle d'un site (cahier des charges § 6.5).

**Paramètres de chemin**
- `id` : identifiant de la ruche.

**Corps (JSON)**

| Champ | Type | Obligatoire |
| --- | --- | --- |
| `timestamp` | date ISO 8601 | oui |
| `weight_kg` | nombre | oui |
| `hive_id` | chaîne | non : s'il est présent, il doit être égal à `id` du chemin |
| `site_id` | chaîne | non |
| `position_lat` | nombre | non |
| `position_lon` | nombre | non |
| `temp_internal_c` | nombre | non |
| `temp_external_c` | nombre | non |
| `humidity_pct` | nombre | non |
| `acoustic_activity_score` | nombre | non |
| `battery_pct` | nombre | non |

Le `timestamp` est celui de la trame (instant où le capteur a pris la mesure), pas l'instant de réception par le serveur. Le serveur le conserve tel quel. Les champs `hive_id` et `site_id` de la mesure enregistrée sont ceux de la ruche du chemin.

**Codes**
- 201 : mesure enregistrée, renvoyée dans le corps.
- 400 : `timestamp` ou `weight_kg` manquant ou invalide, ou `hive_id` du corps différent de celui du chemin.
- 404 : aucune ruche ne porte cet identifiant.

**Exemple de requête**

```json
{
  "timestamp": "2026-10-31T10:00:00Z",
  "position_lat": 12.5743,
  "position_lon": -16.2873,
  "weight_kg": 36.84,
  "temp_internal_c": 34.4,
  "temp_external_c": 27.1,
  "humidity_pct": 64,
  "acoustic_activity_score": 0.42,
  "battery_pct": 88
}
```

**Exemple 201**

```json
{
  "hive_id": "SN-CASA-001",
  "site_id": "SN-CASA",
  "timestamp": "2026-10-31T10:00:00Z",
  "position_lat": 12.5743,
  "position_lon": -16.2873,
  "weight_kg": 36.84,
  "temp_internal_c": 34.4,
  "temp_external_c": 27.1,
  "humidity_pct": 64,
  "acoustic_activity_score": 0.42,
  "battery_pct": 88
}
```

**Exemple 400**

```json
{
  "type": "about:blank",
  "title": "Requête invalide",
  "status": 400,
  "detail": "timestamp et weight_kg sont obligatoires."
}
```

---

## 5. GET /api/hives/:id/measures

Historique des mesures d'une ruche, de la plus récente à la plus ancienne (tri sur `timestamp`).

**Paramètres de chemin**
- `id` : identifiant de la ruche.

**Paramètres de requête**
- `limit` : entier de 1 à 500, 50 par défaut.
- `offset` : entier positif ou nul, 0 par défaut.

Pages successives : `offset=0`, puis `offset=limit`, etc. Deux pages consécutives ne se chevauchent pas.

**Codes**
- 200 : `{ items, limit, offset }`. `items` est vide si la ruche n'a pas (ou plus) de mesures à cette page.
- 400 : `limit` ou `offset` invalide (non entier, hors bornes, négatif).
- 404 : aucune ruche ne porte cet identifiant.

**Exemple 200** (`GET /api/hives/SN-CASA-001/measures?limit=2`)

```json
{
  "items": [
    { "hive_id": "SN-CASA-001", "site_id": "SN-CASA", "timestamp": "2026-10-31T10:15:00Z", "weight_kg": 36.9 },
    { "hive_id": "SN-CASA-001", "site_id": "SN-CASA", "timestamp": "2026-10-31T10:00:00Z", "weight_kg": 36.84 }
  ],
  "limit": 2,
  "offset": 0
}
```

**Exemple 400** (`?limit=501`)

```json
{
  "type": "about:blank",
  "title": "Requête invalide",
  "status": 400,
  "detail": "Le paramètre limit doit être un entier compris entre 1 et 500."
}
```

---

## 6. GET /api/hives/:id/inspections

Liste des inspections d'une ruche.

**Paramètres de chemin**
- `id` : identifiant de la ruche.

**Codes**
- 200 : tableau des inspections de la ruche, dans l'ordre d'enregistrement (vide s'il n'y en a pas).
- 404 : aucune ruche ne porte cet identifiant.

**Exemple 200**

```json
[
  {
    "id": "3f1c2d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
    "hive_id": "SN-CASA-001",
    "inspected_at": "2026-10-31T10:00:00Z",
    "colony_status": "forte",
    "queen_present": true,
    "observations": "Beaucoup de couvain."
  }
]
```

**Exemple 404**

```json
{
  "type": "about:blank",
  "title": "Ressource introuvable",
  "status": 404,
  "detail": "La ruche XX-NOPE-999 n'existe pas."
}
```

---

## 7. POST /api/hives/:id/inspections

Enregistre une inspection de terrain. L'`id` est un UUID généré par l'application mobile, ce qui permet de saisir l'inspection hors ligne puis de la synchroniser sans créer de doublon.

**Paramètres de chemin**
- `id` : identifiant de la ruche.

**Corps (JSON)**

| Champ | Type | Obligatoire |
| --- | --- | --- |
| `id` | UUID | oui |
| `inspected_at` | date ISO 8601 | oui |
| `colony_status` | `"forte"`, `"normale"`, `"faible"` ou `"morte"` | oui |
| `queen_present` | booléen | non |
| `observations` | texte | non |

**Codes**
- 201 : inspection créée, renvoyée dans le corps avec `hive_id`.
- 400 : champ obligatoire manquant ou invalide (UUID, date, `colony_status`, type de `queen_present` ou `observations`).
- 404 : aucune ruche ne porte cet identifiant.
- 409 : une inspection avec cet `id` existe déjà (rejeu de synchronisation ou double saisie).

**Exemple de requête**

```json
{
  "id": "3f1c2d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
  "inspected_at": "2026-10-31T10:00:00Z",
  "colony_status": "forte",
  "queen_present": true,
  "observations": "Beaucoup de couvain."
}
```

**Exemple 201**

```json
{
  "id": "3f1c2d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
  "hive_id": "SN-CASA-001",
  "inspected_at": "2026-10-31T10:00:00Z",
  "colony_status": "forte",
  "queen_present": true,
  "observations": "Beaucoup de couvain."
}
```

**Exemple 400**

```json
{
  "type": "about:blank",
  "title": "Requête invalide",
  "status": 400,
  "detail": "colony_status doit valoir forte, normale, faible ou morte."
}
```

**Exemple 409**

```json
{
  "type": "about:blank",
  "title": "Conflit",
  "status": 409,
  "detail": "Une inspection avec cet id existe déjà."
}
```
