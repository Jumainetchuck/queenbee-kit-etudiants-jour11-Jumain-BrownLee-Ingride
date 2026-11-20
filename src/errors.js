// Erreurs métier : elles ne connaissent pas HTTP.
// C'est l'intergiciel d'erreurs qui les traduit en codes de statut.

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Ajoutée pour garder le comportement du TP 3 (409 sur une inspection déjà enregistrée).
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}