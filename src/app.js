import express from "express";
import { requestLogger } from "./middlewares/requestLogger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { createHivesService } from "./services/hives.service.js";
import { createMeasuresService } from "./services/measures.service.js";
import { createInspectionsService } from "./services/inspections.service.js";
import { createHivesController } from "./controllers/hives.controller.js";
import { createHivesRouter } from "./routes/hives/hives.router.js";

// Assemble les couches. Les accès aux données arrivent en paramètres : app.js ne sait pas
// s'ils viennent de la mémoire ou de PostgreSQL.
export function createApp({ hivesRepository, measuresRepository, inspectionsRepository }) {
  const app = express();

  app.use(express.json()); // AVANT les routes
  app.use(requestLogger);

  const hivesService = createHivesService({ hivesRepository });
  const measuresService = createMeasuresService({ hivesService, measuresRepository });
  const inspectionsService = createInspectionsService({ hivesService, inspectionsRepository });
  const hivesController = createHivesController({ hivesService, measuresService, inspectionsService });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/hives", createHivesRouter(hivesController));

  // À la fin, après toutes les routes
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}