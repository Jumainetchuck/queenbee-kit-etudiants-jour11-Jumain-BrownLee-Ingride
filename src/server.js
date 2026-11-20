import express from "express";
import { requestLogger } from "./middlewares/requestLogger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { sendProblem } from "./utils/problem.js";

const app = express();

app.use(express.json()); // AVANT les routes, sinon req.body est undefined
app.use(requestLogger);

// ---------- Données en mémoire ----------
const hives = [
  { id: "SN-CASA-001", site_id: "SN-CASA", status: "active" },
  { id: "SN-CASA-002", site_id: "SN-CASA", status: "active" },
  { id: "SN-CASA-003", site_id: "SN-CASA", status: "inactive" },
  { id: "SN-DAKA-001", site_id: "SN-DAKA", status: "active" },
  { id: "SN-DAKA-002", site_id: "SN-DAKA", status: "active" },
];
const measures = [];
const inspections = [];

const STATUTS = ["forte", "normale", "faible", "morte"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Renvoie la ruche ou répond 404 (et renvoie null).
function trouverRuche(req, res) {
  const hive = hives.find((h) => h.id === req.params.id);
  if (!hive) {
    sendProblem(res, 404, `La ruche ${req.params.id} n'existe pas.`);
    return null;
  }
  return hive;
}

const estDateValide = (v) => typeof v === "string" && !Number.isNaN(Date.parse(v));

// ---------- Routes ----------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/hives", (req, res) => {
  const { site_id } = req.query;
  // `if (site_id)` traite aussi la chaîne vide ("?site_id=") comme « pas de filtre »
  res.json(site_id ? hives.filter((h) => h.site_id === site_id) : hives);
});

app.get("/api/hives/:id", (req, res) => {
  const hive = trouverRuche(req, res);
  if (!hive) return;
  res.json(hive);
});

app.post("/api/hives/:id/measures", (req, res) => {
  const hive = trouverRuche(req, res);
  if (!hive) return;

  const body = req.body ?? {};

  if (body.timestamp === undefined || body.weight_kg === undefined) {
    return sendProblem(res, 400, "timestamp et weight_kg sont obligatoires.");
  }
  if (!estDateValide(body.timestamp)) {
    return sendProblem(res, 400, "timestamp doit être une date ISO 8601.");
  }
  if (typeof body.weight_kg !== "number" || !Number.isFinite(body.weight_kg)) {
    return sendProblem(res, 400, "weight_kg doit être un nombre.");
  }
  if (body.hive_id !== undefined && body.hive_id !== hive.id) {
    return sendProblem(res, 400, "hive_id ne correspond pas à l'identifiant de l'URL.");
  }

  // On garde le timestamp de la trame (instant de la prise par le capteur)
  const mesure = { ...body, hive_id: hive.id, site_id: hive.site_id };
  measures.push(mesure);
  res.status(201).json(mesure);
});

app.get("/api/hives/:id/measures", (req, res) => {
  const hive = trouverRuche(req, res);
  if (!hive) return;

  const limitBrut = req.query.limit ?? "50";
  const offsetBrut = req.query.offset ?? "0";

  // /^\d+$/ rejette "abc", "-1", "1.5" et "" (Number("") vaudrait 0 : piège)
  const limit = /^\d+$/.test(limitBrut) ? Number(limitBrut) : NaN;
  const offset = /^\d+$/.test(offsetBrut) ? Number(offsetBrut) : NaN;

  if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
    return sendProblem(res, 400, "Le paramètre limit doit être un entier compris entre 1 et 500.");
  }
  if (!Number.isInteger(offset) || offset < 0) {
    return sendProblem(res, 400, "Le paramètre offset doit être un entier positif ou nul.");
  }

  const items = measures
    .filter((m) => m.hive_id === hive.id)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)) // plus récente d'abord
    .slice(offset, offset + limit);

  res.json({ items, limit, offset });
});

app.get("/api/hives/:id/inspections", (req, res) => {
  const hive = trouverRuche(req, res);
  if (!hive) return;
  res.json(inspections.filter((i) => i.hive_id === hive.id));
});

app.post("/api/hives/:id/inspections", (req, res) => {
  const hive = trouverRuche(req, res);
  if (!hive) return;

  const { id, inspected_at, colony_status, queen_present, observations } = req.body ?? {};

  if (typeof id !== "string" || !UUID.test(id)) {
    return sendProblem(res, 400, "id doit être un UUID.");
  }
  if (!estDateValide(inspected_at)) {
    return sendProblem(res, 400, "inspected_at doit être une date ISO 8601.");
  }
  if (!STATUTS.includes(colony_status)) {
    return sendProblem(res, 400, "colony_status doit valoir forte, normale, faible ou morte.");
  }
  if (queen_present !== undefined && typeof queen_present !== "boolean") {
    return sendProblem(res, 400, "queen_present doit être un booléen.");
  }
  if (observations !== undefined && typeof observations !== "string") {
    return sendProblem(res, 400, "observations doit être un texte.");
  }
  if (inspections.some((i) => i.id === id)) {
    return sendProblem(res, 409, "Une inspection avec cet id existe déjà.");
  }

  const inspection = { id, hive_id: hive.id, inspected_at, colony_status, queen_present, observations };
  inspections.push(inspection);
  res.status(201).json(inspection);
});

// ---------- À la fin, après toutes les routes ----------
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(4000, () => console.log("API sur http://localhost:4000"));