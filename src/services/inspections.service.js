import { ValidationError, ConflictError } from "../errors.js";

const STATUTS = ["forte", "normale", "faible", "morte"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const estDateValide = (v) => typeof v === "string" && !Number.isNaN(Date.parse(v));

export function createInspectionsService({ hivesService, inspectionsRepository }) {
  return {
    async listByHive(hiveId) {
      const hive = await hivesService.getById(hiveId);
      return inspectionsRepository.findByHive(hive.id);
    },

    async create(hiveId, body) {
      const hive = await hivesService.getById(hiveId);
      const { id, inspected_at, colony_status, queen_present, observations } = body;

      if (typeof id !== "string" || !UUID.test(id)) {
        throw new ValidationError("id doit être un UUID.");
      }
      if (!estDateValide(inspected_at)) {
        throw new ValidationError("inspected_at doit être une date ISO 8601.");
      }
      if (!STATUTS.includes(colony_status)) {
        throw new ValidationError("colony_status doit valoir forte, normale, faible ou morte.");
      }
      if (queen_present !== undefined && typeof queen_present !== "boolean") {
        throw new ValidationError("queen_present doit être un booléen.");
      }
      if (observations !== undefined && typeof observations !== "string") {
        throw new ValidationError("observations doit être un texte.");
      }
      if (await inspectionsRepository.findById(id)) {
        throw new ConflictError("Une inspection avec cet id existe déjà.");
      }

      const inspection = { id, hive_id: hive.id, inspected_at, colony_status, queen_present, observations };
      return inspectionsRepository.add(inspection);
    },
  };
}