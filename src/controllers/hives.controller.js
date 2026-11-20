// Le contrôleur lit la requête, appelle les services, choisit le code de réponse.
// Pas de règle métier ici. Les erreurs sont simplement lancées : Express 5 transmet
// toute erreur d'un handler async à l'intergiciel d'erreurs.
export function createHivesController({ hivesService, measuresService, inspectionsService }) {
  return {
    async list(req, res) {
      res.json(await hivesService.list({ siteId: req.query.site_id }));
    },

    async getOne(req, res) {
      res.json(await hivesService.getById(req.params.id));
    },

    async createMeasure(req, res) {
      const mesure = await measuresService.add(req.params.id, req.body ?? {});
      res.status(201).json(mesure);
    },

    async listMeasures(req, res) {
      res.json(
        await measuresService.listByHive(req.params.id, {
          limit: req.query.limit,
          offset: req.query.offset,
        })
      );
    },

    async listInspections(req, res) {
      res.json(await inspectionsService.listByHive(req.params.id));
    },

    async createInspection(req, res) {
      const inspection = await inspectionsService.create(req.params.id, req.body ?? {});
      res.status(201).json(inspection);
    },
  };
}