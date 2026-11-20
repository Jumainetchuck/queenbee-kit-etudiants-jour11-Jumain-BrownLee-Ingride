export function createMemoryMeasuresRepository() {
  const mesures = [];

  return {
    async add(mesure) {
      mesures.push(mesure);
      return mesure;
    },
    // Page de mesures d'une ruche, de la plus récente à la plus ancienne.
    async findByHive(hiveId, { limit, offset }) {
      return mesures
        .filter((m) => m.hive_id === hiveId)
        .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        .slice(offset, offset + limit);
    },
  };
}