import { Router } from "express";

// Quelle URL, quel verbe, quel handler. Aucune logique.
// Le routeur est monté sur /api/hives dans app.js : les chemins ci-dessous sont relatifs.
export function createHivesRouter(controller) {
  const router = Router();

  router.get("/", controller.list);
  router.get("/:id", controller.getOne);
  router.post("/:id/measures", controller.createMeasure);
  router.get("/:id/measures", controller.listMeasures);
  router.get("/:id/inspections", controller.listInspections);
  router.post("/:id/inspections", controller.createInspection);

  return router;
}