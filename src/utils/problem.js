const TITRES = {
  400: "Requête invalide",
  404: "Ressource introuvable",
  409: "Conflit",
  500: "Erreur interne",
};

// Envoie une erreur au format RFC 9457 (application/problem+json).
export function sendProblem(res, status, detail) {
  res
    .status(status)
    .type("application/problem+json")
    .json({
      type: "about:blank",
      title: TITRES[status] ?? "Erreur",
      status,
      detail,
    });
}