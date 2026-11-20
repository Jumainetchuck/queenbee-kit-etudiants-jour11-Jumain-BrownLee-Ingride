import { NotFoundError } from "../errors.js";

export function createHivesService({ hivesRepository }) {
  return {
    async list({ siteId } = {}) {
      // `siteId || undefined` : une chaîne vide ("?site_id=") veut dire « pas de filtre »
      return hivesRepository.findAll({ siteId: siteId || undefined });
    },

    async getById(id) {
      const hive = await hivesRepository.findById(id);
      if (!hive) throw new NotFoundError(`La ruche ${id} n'existe pas.`);
      return hive;
    },
  };
}