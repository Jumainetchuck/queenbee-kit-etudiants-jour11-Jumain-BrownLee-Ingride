// TP 1 — Lire les mesures sans bloquer la boucle d'événements. Version de départ.
//
//   GET  /ping              déjà écrite : elle joue « l'autre utilisateur »
//   POST /import/bloquant   À ÉCRIRE : lire tout le fichier d'un coup (readFileSync)
//   POST /import/flux       À ÉCRIRE : lire le fichier ligne par ligne (createReadStream + readline)
//
// Lancement, depuis la racine du projet :
//   node tp/tp1-lecture/serveur-depart.js data/mesures-SN-CASA-2026-10-31_30j.ndjson
// Puis, dans un second terminal : node tp/tp1-lecture/sonde.js bloquant (ou flux)

import express from "express";
import { existsSync } from "node:fs";
import {createImportRoutes} from "./routes/import.routes.js";

const FICHIER = process.argv[2] ?? "data/mesures-SN-CASA-2026-10-31.ndjson";

// Le chemin du fichier est relatif au dossier depuis lequel on lance la commande.
if (!existsSync(FICHIER)) {
  console.error(`Fichier introuvable : ${FICHIER}`);
  console.error("Lancez le serveur depuis la racine du projet. Pour générer le fichier de 30 jours :");
  console.error("  node scripts/generate-measures.js SN-CASA 2026-10-31 30");
  process.exit(1);
}

const app = express();

app.get("/ping", (req, res) => {
  res.json({ pong: true });
});

app.use("/import", createImportRoutes(FICHIER));

app.listen(4000, () => {
  console.log(`Serveur du TP 1 sur http://localhost:4000, fichier : ${FICHIER}`);
});
