import { ValidationError } from "../errors.js";

// Plages physiques retenues pour le module (UC-CY02 du cahier des charges).
export const PLAGES = {
  position_lat: [-90, 90],
  position_lon: [-180, 180],
  weight_kg: [0, 150],
  temp_internal_c: [-10, 60],
  temp_external_c: [-20, 60],
  humidity_pct: [0, 100],
  acoustic_activity_score: [0, 1],
  battery_pct: [0, 100],
};

const estDateValide = (v) => typeof v === "string" && !Number.isNaN(Date.parse(v));

function validerMesure(hive, body) {
  if (body.timestamp === undefined || body.weight_kg === undefined) {
    throw new ValidationError("timestamp et weight_kg sont obligatoires.");
  }
  if (!estDateValide(body.timestamp)) {
    throw new ValidationError("timestamp doit être une date ISO 8601.");
  }
  if (body.hive_id !== undefined && body.hive_id !== hive.id) {
    throw new ValidationError("hive_id ne correspond pas à l'identifiant de l'URL.");
  }

  for (const [champ, [min, max]] of Object.entries(PLAGES)) {
    const valeur = body[champ];
    if (valeur === undefined) continue; // facultatif, sauf weight_kg déjà vérifié
    if (typeof valeur !== "number" || !Number.isFinite(valeur)) {
      throw new ValidationError(`${champ} doit être un nombre.`);
    }
    if (valeur < min || valeur > max) {
      throw new ValidationError(`${champ} doit être compris entre ${min} et ${max}.`);
    }
  }
}

// /^\d+$/ rejette "abc", "-1", "1.5" et "" (Number("") vaudrait 0 : piège)
function lireEntier(brut, defaut) {
  const texte = brut ?? String(defaut);
  return /^\d+$/.test(texte) ? Number(texte) : NaN;
}

export function createMeasuresService({ hivesService, measuresRepository }) {
  return {
    async add(hiveId, body) {
      const hive = await hivesService.getById(hiveId); // NotFoundError si la ruche n'existe pas
      validerMesure(hive, body);

      // On garde le timestamp de la trame (instant de la prise par le capteur)
      const mesure = { ...body, hive_id: hive.id, site_id: hive.site_id };
      return measuresRepository.add(mesure);
    },

    async listByHive(hiveId, { limit, offset } = {}) {
      const hive = await hivesService.getById(hiveId);

      const l = lireEntier(limit, 50);
      const o = lireEntier(offset, 0);
      if (!Number.isInteger(l) || l < 1 || l > 500) {
        throw new ValidationError("Le paramètre limit doit être un entier compris entre 1 et 500.");
      }
      if (!Number.isInteger(o) || o < 0) {
        throw new ValidationError("Le paramètre offset doit être un entier positif ou nul.");
      }

      const items = await measuresRepository.findByHive(hive.id, { limit: l, offset: o });
      return { items, limit: l, offset: o };
    },
  };
}