# TP1
## Test sur une série de 30 jours et 1 jours
### serie de 30 jours
* bloquant *
  - mesures: 144000
  - poids_moyen_kg: 38.74
  - duree_ms: 224.96
  - pire /ping: 219 ms

* flux *
  - mesures: 144000
  - poids_moyen_kg: 38.74
  - duree_ms: 225.19
  - pire /ping: 3 ms

### serie de 1 jours
* bloquant *
  - mesures: 4800
  - poids_moyen_kg: 37.86
  - duree_ms: 7.67
  - pire /ping: 3 ms

* flux *
  - mesures: 4800
  - poids_moyen_kg: 37.86
  - duree_ms: 12.65
  - pire /ping: 3 ms

# Questions:
1.Pourquoi /ping attend-il pendant l’import bloquant ?  
--> Node.js exécute le JavaScript sur un seul thread. readFileSync, le découpage et les JSON.parse s’exécutent d’un bloc sans rendre la main, donc la boucle d’événements ne peut traiter aucune autre requête avant la fin.

2.La lecture en flux est-elle plus rapide ?  
--> Non, le travail total est le même, voire un peu plus long. Elle apporte la réactivité : for await rend la main à la boucle d’événements entre deux morceaux, donc les autres requêtes sont servies, et la mémoire reste faible (pas besoin de charger tout le fichier).

3.Pourquoi l’effet est-il presque invisible avec 1 jour ?  
--> 4 800 lignes se traitent en quelques millisecondes : le blocage est trop court pour être perçu par la sonde (ping toutes les 10 ms).

# TP2
## Verification:
- [x] GET /api/hives?site_id=SN-CASA ne renvoie que des ruches de SN-CASA
- [x] GET /api/hives/XX-NOPE-999 renvoie 404
- [x] Une mesure créée renvoie 201, pas 200
- [x] Chaque requête apparaît une seule fois dans le journal

# TP3
## contrat du projet:
 ./docs/api.md

# TP4:
## rendu:

```
npm test
  > queenbee-kit-etudiants-jour1@1.0.0 test
  > node --test

  ✔ refuse un poids hors de sa plage physique (1.261379ms)
  ✔ enregistre une mesure valide (4.102468ms)
  ℹ tests 2
  ℹ suites 0
  ℹ pass 2
  ℹ fail 0
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 80.159935
```
