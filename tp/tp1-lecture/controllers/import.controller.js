import { readFileSync, createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { performance } from "node:perf_hooks";

export function createImportController(fichier) {

  // POST /import/bloquant
  function importBloquant(req, res) {
    try {
      const debut = performance.now();

      const contenu = readFileSync(fichier, "utf8");

      const lignes = contenu.split(/\r?\n/);

      let mesures = 0;
      let poidsTotal = 0;

      for (const ligne of lignes) {
        if (!ligne.trim()) continue;

        const mesure = JSON.parse(ligne);

        mesures++;
        poidsTotal += mesure.weight_kg;
      }

      const duree = performance.now() - debut;

      res.json({
        mesures,
        poids_moyen_kg: mesures > 0 ? poidsTotal / mesures : 0,
        duree_ms: duree
      });

    } catch (error) {
      res.status(500).json({
        erreur: error.message
      });
    }
  }

  // POST /import/flux
  async function importFlux(req, res) {
    try {
      const debut = performance.now();

      const flux = createReadStream(fichier, {
        encoding: "utf8"
      });

      const lignes = createInterface({
        input: flux,
        crlfDelay: Infinity
      });

      let mesures = 0;
      let poidsTotal = 0;

      for await (const ligne of lignes) {
        if (!ligne.trim()) continue;

        const mesure = JSON.parse(ligne);

        mesures++;
        poidsTotal += mesure.weight_kg;
      }

      const duree = performance.now() - debut;

      res.json({
        mesures,
        poids_moyen_kg: mesures > 0 ? poidsTotal / mesures : 0,
        duree_ms: duree
      });

    } catch (error) {
      res.status(500).json({
        erreur: error.message
      });
    }
  }

  return {
    importBloquant,
    importFlux
  };
}