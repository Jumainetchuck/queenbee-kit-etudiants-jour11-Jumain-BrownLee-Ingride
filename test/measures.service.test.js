import { test } from "node:test";
import assert from "node:assert/strict";
import { createMeasuresService } from "../src/services/measures.service.js";
import { ValidationError } from "../src/errors.js";

// Fabrique un service avec des faux : un service de ruches qui connaît toutes les ruches,
// et un repository qui garde dans un tableau ce qu'on lui donne.
function preparerService() {
  const enregistrees = [];
  const hivesService = {
    async getById(id) {
      return { id, site_id: "SN-CASA", status: "active" };
    },
  };
  const measuresRepository = {
    async add(mesure) {
      enregistrees.push(mesure);
      return mesure;
    },
    async findByHive() {
      return [];
    },
  };
  return { service: createMeasuresService({ hivesService, measuresRepository }), enregistrees };
}

test("refuse un poids hors de sa plage physique", async () => {
  const { service, enregistrees } = preparerService();

  await assert.rejects(
    () => service.add("SN-CASA-001", { timestamp: "2026-10-31T10:00:00Z", weight_kg: 500 }),
    ValidationError
  );

  assert.equal(enregistrees.length, 0);
});

// Garde-fou : prouve que le faux repository enregistre bien quand la mesure est valide,
// donc que « rien enregistré » dans le test précédent vient bien du refus.
test("enregistre une mesure valide", async () => {
  const { service, enregistrees } = preparerService();

  await service.add("SN-CASA-001", { timestamp: "2026-10-31T10:00:00Z", weight_kg: 36.84 });

  assert.equal(enregistrees.length, 1);
  assert.equal(enregistrees[0].hive_id, "SN-CASA-001");
});