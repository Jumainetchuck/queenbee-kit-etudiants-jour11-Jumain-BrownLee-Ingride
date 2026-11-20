export function createMemoryInspectionsRepository() {
  const inspections = [];

  return {
    async add(inspection) {
      inspections.push(inspection);
      return inspection;
    },
    async findByHive(hiveId) {
      return inspections.filter((i) => i.hive_id === hiveId);
    },
    async findById(id) {
      return inspections.find((i) => i.id === id);
    },
  };
}