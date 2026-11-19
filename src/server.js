import express from "express";
import { requestLogger } from "./middlewares/requestLogger.js";
// import morgan from "morgan";
const app = express();

app.use(express.json());   // AVANT les routes, sinon req.body est undefined
// app.use(morgan("dev")); // AVANT les routes, sinon on ne logue pas les requêtes
app.use(requestLogger); // AVANT les routes, sinon on ne logue pas les requêtes
// Données en mémoire (à adapter avec de vraies ruches du jeu de données)
const hives = [
  { id: "SN-CASA-001", site_id: "SN-CASA", status: "active" },
  { id: "SN-CASA-002", site_id: "SN-CASA", status: "active" },
  { id: "SN-CASA-003", site_id: "SN-CASA", status: "inactive" },
  { id: "SN-DAKA-001", site_id: "SN-DAKA", status: "active" },
  { id: "SN-DAKA-002", site_id: "SN-DAKA", status: "active" },
];
const measures = [];

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/hives", (req, res) => {
  const { site_id } = req.query;
  // `if (site_id)` traite aussi la chaîne vide ("?site_id=") comme « pas de filtre »
  const resultat = site_id ? hives.filter((h) => h.site_id === site_id) : hives;
  res.json(resultat);
});

app.get("/api/hives/:id", (req, res) => {
  const hive = hives.find((h) => h.id === req.params.id);
  if (!hive) return res.status(404).json({ error: "Ruche introuvable" });
  res.json(hive);
});

app.post("/api/hives/:id/measures", (req, res) => {
  const hive = hives.find((h) => h.id === req.params.id);
  if (!hive) return res.status(404).json({ error: "Ruche introuvable" });

  const body = req.body ?? {};

  // weight_kg = 0 est une valeur valide : on teste undefined, pas la « fausseté »
  if (body.timestamp === undefined || body.weight_kg === undefined) {
    return res.status(400).json({ error: "timestamp et weight_kg sont obligatoires" });
  }
  if (body.hive_id !== undefined && body.hive_id !== hive.id) {
    return res.status(400).json({ error: "hive_id ne correspond pas à l'URL" });
  }

  // On garde le timestamp de la trame (instant de la prise par le capteur)
  const mesure = { ...body, hive_id: hive.id, site_id: hive.site_id };
  measures.push(mesure);
  res.status(201).json(mesure);
});

app.listen(4000, () => console.log("API sur http://localhost:4000"));
